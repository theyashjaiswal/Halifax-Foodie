import pandas as pd
import json

train_data = pd.read_json("train.json")
class_names = pd.unique(train_data['cuisine'])

def write_metadata(dataset, mf):
    for i in range(len(dataset)):
        metadata = {
            'classificationAnnotation': {'displayName': dataset['cuisine'][i]},
            'textContent': ",".join(dataset['ingredients'][i])
        }
        json.dump(metadata, mf)
        mf.write('\n')


with open('metadata.jsonl', 'w') as mf:
    write_metadata(dataset, mf)
