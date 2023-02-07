import json
import matplotlib.pyplot as plt
import numpy as np
import os
import argparse
import platform
import shutil
from tqdm import tqdm


parser = argparse.ArgumentParser(description = 'Benchmark plots generator')
parser.add_argument('-m', '--mode', choices=['execution', 'parsing', 'both'], required=True)
args = parser.parse_args()

if args.mode == 'both':
  sources = ['execution', 'parsing']
else:
  sources = [args.mode]

with open(f'commands.json') as f:
  system = 'darwin' if platform.uname().system == 'Darwin' else 'win32'
  browsers = list(json.load(f)[system]['start'].keys())

uname = platform.uname()
results_dir = f'results_{uname.system}-{uname.machine}'

if os.path.exists(results_dir):
  shutil.rmtree(results_dir)

shutil.copytree('results', results_dir)

x = np.flip(np.arange(len(browsers)))

methods = [
  ['Modern', '#d3242b', 3],
  ['TypeScript Legacy', '#1c74b3', 1],
  ['Babel Legacy', '#fa7c0d', -1],
  ['SWC Legacy', '#2ca42c', -3],
]

for benchmark in sources:
  print(f'Starting analyzing {benchmark} results')

  with open(f'{results_dir}/{benchmark}/results.json') as f:
    data = json.load(f)


  def create_plot(fn, figsize, folder_name, feature, values):
    plt.figure(figsize=figsize)

    fn(values, 0.15)

    plt.title(feature, { 'fontsize': 16 }, pad=15)
    plt.yticks(x, browsers, fontsize=12)
    plt.xticks([])
    plt.xlabel(
      'Frequency of operations per second' if benchmark == 'execution' else 'JavaScript parsing speed',
      fontsize=12
    )

    plt.legend(
      [plt.Rectangle((0, 0), 1, 1, fc=x[1]) for x in methods],
      [x[0] for x in methods],
      fontsize=12
    )

    plt.tight_layout()
    directory = feature.split('/')[0]
    os.makedirs(f'{results_dir}/{benchmark}/plots/{folder_name}/{directory}', exist_ok=True)
    plt.savefig(f'{results_dir}/{benchmark}/plots/{folder_name}/{feature}.png')
    plt.close()


  def bar(values, width):
    for label, color, pos in methods:
      plt.barh(x + pos*width/2*1.25, values[label], width, color=color)


  def box(values, width):
    for label, color, pos in methods:
      plot_name = plt.boxplot(
        values[label],
        vert=False,
        positions=(x + pos*width/2*1.25),
        widths=width,
        showfliers=False,
      )

      for k, v in plot_name.items():
        plt.setp(plot_name.get(k), color=color)


  def create_values(fn):
    values = {
      'TypeScript Legacy': [],
      'SWC Legacy': [],
      'Babel Legacy': [],
      'Modern': [],
    }

    for browser in browsers:
      for key in values.keys():
        try:
          method = key.lower().replace(' ', '-')
          value = fn(data[feature][browser][method])
          values[key].append(value)
        except:
          values[key].append(0)

    return values


  description = f'{benchmark.capitalize()}: Bar plots'
  for feature in tqdm(data.keys(), desc=description):
    values = create_values(lambda x: 1 / np.quantile(x, 0.25))
    create_plot(bar, [15, 5], 'bars', feature, values)


  description = f'{benchmark.capitalize()}: Box plots'
  for feature in tqdm(data.keys(), desc=description):
    values = create_values(lambda x: 1 / np.array(x))
    create_plot(box, [15, 7], 'boxes', feature, values)


  description = f'{benchmark.capitalize()}: Browser detailed plots'
  for browser in tqdm(browsers, desc=description):
    es_versions = np.unique(list(map(lambda x: x.split('/')[0], data.keys())))
    es_v_to_features = {}

    for feature in data.keys():
      es_v = feature.split('/')[0]
      if es_v not in es_v_to_features:
        es_v_to_features[es_v] = []
      es_v_to_features[es_v].append(feature)

    n_rows = 0
    for es_v, features in es_v_to_features.items():
      n_rows += int(np.ceil(len(features) / 3))

    plt.figure(figsize=[3 * 5, n_rows * 5])

    current_plot = 0
    for es_v, features in es_v_to_features.items():
      for feature in features:
        plt.subplot(n_rows, 3, current_plot + 1)
        plt.title(feature)
        for label, values in data[feature][browser].items():
          plt.plot(values, label=label)
        plt.xticks([])
        plt.yticks([])
        current_plot += 1
      current_plot = int(np.ceil(current_plot / 3) * 3)

    os.makedirs(f'{results_dir}/{benchmark}/detailed-per-browser', exist_ok=True)
    plt.savefig(f'{results_dir}/{benchmark}/detailed-per-browser/{browser}.png')
    plt.close()


  with open(f'{results_dir}/{benchmark}.md', 'w') as f:
    f.write('# EcmaScript Syntax Features Benchmark\n')

    f.write(f'''
This file contains results of benchmarking {benchmark} speed of
EcmaScript features. Each feature is tested in ESNext and ES5
standards. ES5 standard is compiled by several instruments -
Babel, SWC and TypeScript. Also, each feature is tested in
several popular browsers.
''')

    f.write(f'## System info: {uname.system}, {uname.machine}\n\n')

    print(f'{benchmark.capitalize()}: Human-readable results', end=': ')
    for feature in data.keys():
      f.write(f'### {feature}\n\n')
      f.write(f'Source code: [code](../src/{feature}.ts)\n\n')
      f.write(f'![Bar plot](./{benchmark}/plots/bars/{feature}.png)\n\n')
      f.write(f'''
<details>
  <summary>
    Box plot
  </summary>
  <img alt="Box plot" src="./{benchmark}/plots/boxes/{feature}.png">
</details>
''')
      f.write('\n\n')
    print('Done')

  print(f'{benchmark.capitalize()} results are analyzed')
  print()
