import json
import matplotlib.pyplot as plt
import numpy as np
import os
import argparse
import platform
import shutil
from tqdm import tqdm


def define_box_properties(plot_name, color_code, label):
  for k, v in plot_name.items():
    plt.setp(plot_name.get(k), color=color_code)

  plt.plot([], c=color_code, label=label)
  plt.legend(fontsize=12)


def create_box(values, offset):
  width = 0.15
  return plt.boxplot(
    values,
    vert=False,
    positions=(x - offset*width/2*1.25),
    widths=width
  )


parser = argparse.ArgumentParser(description = 'Benchmark plots generator')
parser.add_argument('-m', '--mode', choices=['execution', 'parsing', 'both'], required=True)
args = parser.parse_args()

if args.mode == 'both':
  sources = ['execution', 'parsing']
else:
  sources = [args.mode]

with open(f'browsers-commands.json') as f:
    browsers = list(json.load(f).keys())

uname = platform.uname()
results_dir = f'results_{uname.system}-{uname.machine}'

if os.path.exists(results_dir):
  shutil.rmtree(results_dir)

shutil.copytree('results', results_dir)

x = np.flip(np.arange(len(browsers)))

for benchmark in sources:
  print(f'Starting analyzing {benchmark} results')

  def bar(feature, babel_values, swc_values, ts_values, modern_values):
    width = 0.15

    fig, ax = plt.subplots(figsize=[15, 5])
    ax.barh(x - 3*width/2*1.25, ts_values, width, label='TypeScript Legacy')
    ax.barh(x - width/2*1.25, babel_values, width, label='Babel Legacy')
    ax.barh(x + width/2*1.25, swc_values, width, label='SWC Legacy')
    ax.barh(x + 3*width/2*1.25, modern_values, width, label='Modern')

    ax.set_title(feature, { 'fontsize': 16 }, pad=15)
    ax.set_yticks(x, browsers, fontsize=12)
    ax.set_xticks([])
    ax.legend(fontsize=12)
    ax.set_xlabel(
      'Frequency of operations per second' if benchmark == 'execution' else 'JavaScript parsing speed',
      fontsize=12
    )

    fig.tight_layout()

    directory = feature.split('/')[0]
    os.makedirs(f'{results_dir}/{benchmark}/plots/bars/{directory}', exist_ok=True)
    plt.savefig(f'{results_dir}/{benchmark}/plots/bars/{feature}.png')
    plt.close()

  def box(feature, babel_values, swc_values, ts_values, modern_values):
    plt.figure(figsize=[15, 8])

    ts_plot = create_box(ts_values, -3)
    babel_plot = create_box(babel_values, -1)
    swc_plot = create_box(swc_values, 1)
    modern_plot = create_box(modern_values, 3)

    define_box_properties(modern_plot, '#d3242b', 'Modern')
    define_box_properties(swc_plot, '#2ca42c', 'SWC')
    define_box_properties(babel_plot, '#fa7c0d', 'Babel')
    define_box_properties(ts_plot, '#1c74b3', 'TypeScript')

    plt.title(feature, { 'fontsize': 16 }, pad=15)
    plt.yticks(x, browsers, fontsize=12)
    plt.xticks([])
    plt.xlabel(
      'Frequency of operations per second' if benchmark == 'execution' else 'JavaScript parsing speed',
      fontsize=12
    )

    plt.tight_layout()

    directory = feature.split('/')[0]
    os.makedirs(f'{results_dir}/{benchmark}/plots/boxes/{directory}', exist_ok=True)
    plt.savefig(f'{results_dir}/{benchmark}/plots/boxes/{feature}.png')
    plt.close()


  with open(f'{results_dir}/{benchmark}/results.json') as f:
    data = json.load(f)

  description = f'{benchmark.capitalize()}: Bar plots'
  for feature in tqdm(data.keys(), desc=description):
    babel_values = []
    swc_values = []
    ts_values = []
    modern_values = []

    for browser in browsers:
      def try_get(method):
        try:
          return 1 / np.quantile(data[feature][browser][method], 0.25)
        except:
          return 0

      babel_values.append(try_get('babel-legacy'))
      swc_values.append(try_get('swc-legacy'))
      ts_values.append(try_get('typescript-legacy'))
      modern_values.append(try_get('modern'))

    bar(feature, babel_values, swc_values, ts_values, modern_values)

  description = f'{benchmark.capitalize()}: Box plots'
  for feature in tqdm(data.keys(), desc=description):
    babel_values = []
    swc_values = []
    ts_values = []
    modern_values = []

    for browser in browsers:
      def try_get(method):
        try:
          return 1 / np.array(data[feature][browser][method])
        except:
          return 0

      babel_values.append(try_get('babel-legacy'))
      swc_values.append(try_get('swc-legacy'))
      ts_values.append(try_get('typescript-legacy'))
      modern_values.append(try_get('modern'))

    box(feature, babel_values, swc_values, ts_values, modern_values)

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
