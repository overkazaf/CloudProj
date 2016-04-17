#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
from PyQt4 import QtCore
from PyQt4 import QtGui

class Tooltip(QtGui.QWidget):
	def __init__(self, parent=None):
		QtGui.QWidget.__init__(self, parent)

		self.resize(600, 400)
		self.move(100, 200)
		self.setWindowTitle('Tooltip Demo')

		tooltipText = '<b>sadfsdfsdf</b><br><b>sdfsdfsdfsdf</b>'

		self.setToolTip('This is a QWidget widget')
		QtGui.QToolTip.setFont(QtGui.QFont('OldEnglish', 10))

app = QtGui.QApplication(sys.argv)
tooltip = Tooltip()
tooltip.show()
sys.exit(app.exec_())