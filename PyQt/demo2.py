#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
from PyQt4 import QtGui

app = QtGui.QApplication(sys.argv)
w1 = QtGui.QWidget()
w1.resize(300, 300)
w1.move(100, 100)
w1.setWindowTitle('demo1')
w1.show()

w2 = QtGui.QWidget()
w2.resize(300, 300)
w2.move(450, 100)
w2.setWindowTitle('demo2')
w2.show()

sys.exit(app.exec_())