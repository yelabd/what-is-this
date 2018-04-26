from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse

import numpy as np
import tensorflow as tf

#Call classify_images (funtion description below)
#Note: All functions(except main) and libraries required

def load_graph(model_file):
  graph = tf.Graph()
  graph_def = tf.GraphDef()

  with open(model_file, "rb") as f:
    graph_def.ParseFromString(f.read())
  with graph.as_default():
    tf.import_graph_def(graph_def)

  return graph


def read_tensor_from_image_file(file_name,
                                input_height=299,
                                input_width=299,
                                input_mean=0,
                                input_std=255):
  input_name = "file_reader"
  output_name = "normalized"
  file_reader = tf.read_file(file_name, input_name)
  if file_name.endswith(".png"):
    image_reader = tf.image.decode_png(
        file_reader, channels=3, name="png_reader")
  elif file_name.endswith(".gif"):
    image_reader = tf.squeeze(
        tf.image.decode_gif(file_reader, name="gif_reader"))
  elif file_name.endswith(".bmp"):
    image_reader = tf.image.decode_bmp(file_reader, name="bmp_reader")
  else:
    image_reader = tf.image.decode_jpeg(
        file_reader, channels=3, name="jpeg_reader")
  float_caster = tf.cast(image_reader, tf.float32)
  dims_expander = tf.expand_dims(float_caster, 0)
  resized = tf.image.resize_bilinear(dims_expander, [input_height, input_width])
  normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])
  sess = tf.Session()
  result = sess.run(normalized)

  return result


def load_labels(label_file):
  label = []
  proto_as_ascii_lines = tf.gfile.GFile(label_file).readlines()
  for l in proto_as_ascii_lines:
    label.append(l.rstrip())
  return label

#Function to call
#Params: 
#   -image_path: Path of image
#   -model_type: 1=flowers
#Returns dictionary with Key=Type, Value=Probability
def classify_image(image_path, model_type):
    graph_path = "models/output_graph.pb"
    label_path = "models/output_labels.txt"
    input_height = 299
    input_width = 299
    input_mean = 0
    input_std = 255
    input_layer = "input"
    output_layer = "InceptionV3/Predictions/Reshape_1"

    if model_type == 1:
        graph_path = "models/output_graph.pb"
        label_path = "models/output_labels.txt"
        input_layer = "Placeholder"
        output_layer = "final_result"
    elif model_type == 2:
        graph_path = "/tmp/output_graph.pb"
        label_path = "/tmp/output_labels.txt"
        input_layer = "Placeholder"
        output_layer = "final_result"

    graph = load_graph(graph_path)

    t = read_tensor_from_image_file(
      image_path,
      input_height=input_height,
      input_width=input_width,
      input_mean=input_mean,
      input_std=input_std)

    input_name = "import/" + input_layer
    output_name = "import/" + output_layer
    input_operation = graph.get_operation_by_name(input_name)
    output_operation = graph.get_operation_by_name(output_name)

    with tf.Session(graph=graph) as sess:
      results = sess.run(output_operation.outputs[0], {
           input_operation.outputs[0]: t
      })
    results = np.squeeze(results)

    top_k = results.argsort()[-5:][::-1]
    labels = load_labels(label_path)

    pairs = {}

    for i in top_k:
        pairs[labels[i]] = results[i]
        print(labels[i],results[i])

    return pairs

if __name__ == "__main__":
    classify_image("catt1.jpg",2)


