#!/usr/bin/python
# -*- coding: utf-8 -*-
from PyQt4.QtCore import *  
from PyQt4.QtGui import *  
import sys

#for demo use
import random

__author__ = 'overkazaf'

class TextEdit(QTextEdit):  
   
    def __init__(self,parent=None):  
        super(TextEdit,self).__init__(parent)  
        self.cmp=None  
   
    def setCompleter(self,completer):  
        if self.cmp:  
            self.disconnect(self.cmp,0,0)  
        self.cmp=completer  
        if (not self.cmp):  
            return  
        self.cmp.setWidget(self)  
        self.cmp.setCompletionMode(QCompleter.PopupCompletion)  
        self.cmp.setCaseSensitivity(Qt.CaseInsensitive)  
        self.connect(self.cmp,SIGNAL('activated(QString)'), self.insertCompletion)  
   
    def completer(self):  
        return self.cmp  
   
    def insertCompletion(self,string):  
        
        #get cursor position
        tc=self.textCursor()
        
        #selectd ranges
        tc.movePosition(QTextCursor.StartOfWord, QTextCursor.KeepAnchor)  

        #replace selected ranges
        tc.insertText(string)

        #set cursor pos back to original pos
        self.setTextCursor(tc)  
   
    def textUnderCursor(self):  
        tc=self.textCursor()  
        tc.select(QTextCursor.WordUnderCursor)  
        return tc.selectedText()  
   
    def keyPressEvent(self,e):  
        print 'pressed >> ', e.text()
        if (self.cmp and self.cmp.popup().isVisible()):  
            if e.key() in (Qt.Key_Enter,Qt.Key_Return,Qt.Key_Escape,Qt.Key_Tab,Qt.Key_Backtab):  
                e.ignore()  
                return  
        
        isShortcut=((e.modifiers() & Qt.ControlModifier) and e.key()==Qt.Key_E)  
        if (not self.cmp or not isShortcut):  
            super(TextEdit,self).keyPressEvent(e)  
   
        ctrlOrShift=e.modifiers() & (Qt.ControlModifier | Qt.ShiftModifier)  
        if (not self.cmp or (ctrlOrShift and e.text().isEmpty())):  
            return  
   
        eow=QString("~!@#$%^&*()_+{}|:\"<>?,./;'[]\\-=")  
        hasModifier=(e.modifiers() != Qt.NoModifier) and not ctrlOrShift  
        completionPrefix = self.textUnderCursor()

        #hide popup while matching invalid cases
        if (not isShortcut and (hasModifier or e.text().isEmpty() or completionPrefix.length()<1  
                       or eow.contains(e.text().right(1)))):  
            self.cmp.popup().hide()  
            return
        
        self.cmp.update(completionPrefix)  
        self.cmp.popup().setCurrentIndex(self.cmp.completionModel().index(0, 0))  
   
        cr = self.cursorRect()  
        cr.setWidth(self.cmp.popup().sizeHintForColumn(0)  
                    + self.cmp.popup().verticalScrollBar().sizeHint().width())  
        self.cmp.complete(cr)  
   
class Completer(QCompleter):  
    def __init__(self,stringlist,parent=None):  
        super(Completer,self).__init__(parent)  
        self.stringlist=stringlist  
        self.setModel(QStringListModel())  
   
    #update function will trigger while the text has been modified
    def update(self,completionText):
    	#generate a new QStringList instance
    	qsList=QStringList()

    	#generate hint lists which returns by customatic definitions
    	newList=genMyStrList(completionText)
    	for item in newList:
    		qsList.append(item)

    	self.stringlist=qsList
        filteredList=self.stringlist.filter(completionText,Qt.CaseInsensitive)
        self.model().setStringList(filteredList)  
        self.popup().setCurrentIndex(self.model().index(0, 0))  

#the function below defined a way to generate a string list
def genMyStrList(key):
	print 'key to gen list >> ', key
	l1 = ['apple', 'app', 'application', 'apply', 'happy']
	l2 = ['please', 'complete', 'simple', 'example', 'completed', 'princeples']
	list = []
	list.append(l1)
	list.append(l2)
	index = random.randint(0, 1)
	return list[index]
   
def main():
	app = QApplication(sys.argv)
	QSList = QStringList()
	#default
	#QSList<<'One'<<'Tow'<<'Three'<<'Four'<<'Five'
	
	#instance of Completer class
	cmp = Completer(QSList)
	
	window = QMainWindow()
	window.setWindowTitle('Auto Complete Demo')
	window.resize(400,200)
	window.move(200,100)
	
	edit=TextEdit()
	edit.setFontPointSize(40)
	edit.setCompleter(cmp)
	
	window.setCentralWidget(edit)
	window.show()
	sys.exit(app.exec_())


if __name__ == '__main__':
	print 'app is running succefully'
	main()