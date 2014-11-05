iMacroLibrary
=============

JS library to make working with iMacros easier.

=============

iMacros issues/notes
  1. Many essential window methods/properties such as window.console, window.alert, etc are blocked through iMacros. 
     An unsafeWindow can be created that overcomes this, and in the library window is redefined as unsafeWindow early on.
     realwindow is holding the real/original window object.
  2. Accessing DOM elements, however, requires using the real/original window object's document. 
     document = realWindow.document
  3. Sometimes a "can't access dead object" error comes up when trying to access some property of an old document element
     
