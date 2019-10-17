import tensorflow as tf
import numpy as np
import scipy.io
import scipy.misc
import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

# 内容图片路径
CONTENT_IMAGE = '../data/a.jpg'
# 风格图片路径
STYLE_IMAGE = '../data/gg.jpg'
# 输出图片路径
OUTPUT_IMAGE = '../output/output'

# 预训练的vgg模型路径
VGG_MODEL_PATH = 'imagenet-vgg-verydeep-19.mat'
# 图片宽度
IMAGE_WIDTH = 450
# 图片高度
IMAGE_HEIGHT = 300
# 定义计算内容损失的vgg层名称及对应权重的列表
CONTENT_LOSS_LAYERS = [('conv4_2', 0.5),('conv5_2',0.5)]
# 定义计算风格损失的vgg层名称及对应权重的列表
STYLE_LOSS_LAYERS = [('conv1_1', 0.2), ('conv2_1', 0.2), ('conv3_1', 0.2), ('conv4_1', 0.2), ('conv5_1', 0.2)]

# 噪音比率
NOISE = 0.5
# 图片RGB均值
IMAGE_MEAN_VALUE = [128.0, 128.0, 128.0]
# 内容损失权重
ALPHA = 1
# 风格损失权重
BETA = 500
# 训练次数
TRAIN_STEPS = 1

class Model(object):
    def __init__(self, content_path, style_path):
        self.content = self.loadimg(content_path)
        self.style = self.loadimg(style_path)
        self.random_img = self.get_random_img() 
        self.net = self.vggnet()

    def vggnet(self):
        # 读取预训练的vgg模型
        vgg = scipy.io.loadmat(VGG_MODEL_PATH)
        vgg_layers = vgg['layers'][0]
        for i in vgg_layers:
            print("vgg_layers", i)
        net = {}
        net['input'] = tf.Variable(np.zeros([1, IMAGE_HEIGHT, IMAGE_WIDTH, 3]), dtype=tf.float32)
        net['conv1_1'] = self.conv_relu(net['input'], self.get_wb(vgg_layers, 0))
        net['conv1_2'] = self.conv_relu(net['conv1_1'], self.get_wb(vgg_layers, 2))
        net['pool1'] = self.pool(net['conv1_2'])
        net['conv2_1'] = self.conv_relu(net['pool1'], self.get_wb(vgg_layers, 5))
        net['conv2_2'] = self.conv_relu(net['conv2_1'], self.get_wb(vgg_layers, 7))
        net['pool2'] = self.pool(net['conv2_2'])
        net['conv3_1'] = self.conv_relu(net['pool2'], self.get_wb(vgg_layers, 10))
        net['conv3_2'] = self.conv_relu(net['conv3_1'], self.get_wb(vgg_layers, 12))
        net['conv3_3'] = self.conv_relu(net['conv3_2'], self.get_wb(vgg_layers, 14))
        net['conv3_4'] = self.conv_relu(net['conv3_3'], self.get_wb(vgg_layers, 16))
        net['pool3'] = self.pool(net['conv3_4'])
        net['conv4_1'] = self.conv_relu(net['pool3'], self.get_wb(vgg_layers, 19))
        net['conv4_2'] = self.conv_relu(net['conv4_1'], self.get_wb(vgg_layers, 21))
        net['conv4_3'] = self.conv_relu(net['conv4_2'], self.get_wb(vgg_layers, 23))
        net['conv4_4'] = self.conv_relu(net['conv4_3'], self.get_wb(vgg_layers, 25))
        net['pool4'] = self.pool(net['conv4_4'])
        net['conv5_1'] = self.conv_relu(net['pool4'], self.get_wb(vgg_layers, 28))
        net['conv5_2'] = self.conv_relu(net['conv5_1'], self.get_wb(vgg_layers, 30))
        net['conv5_3'] = self.conv_relu(net['conv5_2'], self.get_wb(vgg_layers, 32))
        net['conv5_4'] = self.conv_relu(net['conv5_3'], self.get_wb(vgg_layers, 34))
        net['pool5'] = self.pool(net['conv5_4'])
        return net

    def conv_relu(self, input, wb):
        conv = tf.nn.conv2d(input, wb[0], strides=[1, 1, 1, 1], padding='SAME')
        relu = tf.nn.relu(conv + wb[1])
        return relu

    def pool(self, input):
        return tf.nn.max_pool(input, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

    def get_wb(self, layers, i):
        w = tf.constant(layers[i][0][0][0][0][0])
        bias = layers[i][0][0][0][0][1]
        b = tf.constant(np.reshape(bias, (bias.size)))
        return w, b

    def get_random_img(self):
        noise_image = np.random.uniform(-20, 20, [1, IMAGE_HEIGHT, IMAGE_WIDTH, 3])
        random_img = noise_image * NOISE + self.content * (1 - NOISE)
        return random_img

    def loadimg(self, path):
        image = scipy.misc.imread(path)
        image = scipy.misc.imresize(image, [IMAGE_HEIGHT, IMAGE_WIDTH])
        image = np.reshape(image, (1, IMAGE_HEIGHT, IMAGE_WIDTH, 3))
        image = image - IMAGE_MEAN_VALUE
        return image

def gram(x, size, deep):
    x = tf.reshape(x, (size, deep))
    g = tf.matmul(tf.transpose(x), x)
    return g

def loss(sess, model):
#    content_layers = CONTENT_LOSS_LAYERS
#    sess.run(tf.assign(model.net['input'], model.content))
#    content_loss = 0.0
#    for layer_name, weight in content_layers:
#        p = sess.run(model.net[layer_name])
#        x = model.net[layer_name]
#        M = p.shape[1] * p.shape[2]
#        N = p.shape[3]
#        content_loss += (1.0 / (2 * M * N)) * tf.reduce_sum(tf.pow(p - x, 2)) * weight
#    content_loss /= len(content_layers)

    style_layers = STYLE_LOSS_LAYERS
    sess.run(tf.assign(model.net['input'], model.style))
    style_loss = 0.0
    tA = 0
    for layer_name, weight in style_layers:
        a = sess.run(model.net[layer_name])
        print('aa', a.shape)
        x = model.net[layer_name]
        M = a.shape[1] * a.shape[2]
        N = a.shape[3]
        A = gram(a, M, N)
        G = gram(x, M, N)
        style_loss += (1.0 / (4 * M * M * N * N)) * tf.reduce_sum(tf.pow(G - A, 2)) * weight
        tA += tf.reduce_sum(tf.pow(G - A, 2))

#    loss = ALPHA * content_loss + BETA * style_loss
    print("style_loss", style_loss)
    return style_loss, tA

def train():
    model = Model(CONTENT_IMAGE, STYLE_IMAGE)
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        style_loss, tA = loss(sess, model)
        sess.run(tf.global_variables_initializer())
        sess.run(tf.assign(model.net['input'], model.content))
        for step in range(TRAIN_STEPS):
            print("COST2", sess.run(style_loss))
            print("COST2", sess.run(tA))
train()
