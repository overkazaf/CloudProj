from PyQt4.QtCore import Qt
from PyQt4.QtGui import (
     QApplication, QWidget, QLabel, QLineEdit, QTextEdit,
     QFrame, QGridLayout, QVBoxLayout,
     )

class Window(QWidget):
     def __init__(self):
         QWidget.__init__(self)
         self.resize(400, 200)
         self.frame = QFrame(self)
         self.frame.setFrameShape(QFrame.Box)
         grid = QGridLayout(self.frame)
         grid.addWidget(QLabel('Item 1', self.frame), 0, 0)
         grid.addWidget(QLineEdit(self.frame), 0, 1)
         label = QLabel('Item 2', self.frame)
         label.setAlignment(Qt.AlignLeft|Qt.AlignTop)
         textedit = QTextEdit(self.frame)
         textedit.setMaximumHeight(label.sizeHint().height() * 4)
         grid.addWidget(label, 1, 0)
         grid.addWidget(textedit, 1, 1)
         grid.addWidget(QLabel('Item 3', self.frame), 2, 0)
         grid.addWidget(QLineEdit(self.frame), 2, 1)
         vbox = QVBoxLayout(self)
         vbox.addWidget(self.frame)
         vbox.addStretch()


if __name__ == "__main__":

     import sys
     app = QApplication(sys.argv)
     win = Window()
     win.show()
     sys.exit(app.exec_())