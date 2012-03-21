(function() {
  //var Range,
  var applyToShareJS;

//  Range = require("ace/range").Range;

  applyToShareJS = function(editorDoc, delta, doc) {
    var getStartOffsetPosition, pos, text;
    getStartOffsetPosition = function(range) {
      var i, line, lines, offset, _len;
      lines = editorDoc.getLines(0, range.start.row);
      offset = 0;
      for (i = 0, _len = lines.length; i < _len; i++) {
        line = lines[i];
        offset += i < range.start.row ? line.length : range.start.column;
      }
      return offset + range.start.row;
    };
    change = delta;
    while (1)
    {
        pos = editorDoc.indexFromPos(change.from); 
            action = 'insertText';
            if (change.text[0] == "" && change.text.length == 1)
            {
                if (change.from.line != change.to.line)
                    action = 'removeLines';
                else
                    action = 'removeText';
               end_pos = editorDoc.indexFromPos(change.to); 
            } 
            else
            {
                if (change.text.length > 1)
                    action = 'insertLines';
                else
                    action = 'insertText';
            }
            switch (action) {
                case 'insertText':
                    doc.insert(pos, change.text[0]);
                    break;
                case 'removeText':
                    doc.del(pos, end_pos - pos);
                    break;
                case 'insertLines':
                    text = change.text.join('\n');
                    doc.insert(pos, text);
                    break;
                case 'removeLines':
                    //text = change.text.join('\n') + '\n';
                    doc.del(pos,end_pos - pos);
                    break;
                default:
                    throw new Error("unknown action: " + delta.action);
            }

        if (!change.next)
            break;
        change = change.next;
    }
 };

  window.sharejs.Doc.prototype.attach_codemirror = function(editor, keepEditorContents) {
    var check, doc, docListener, editorDoc, editorListener, offsetToPos, suppress;
    if (!this.provides['text']) {
      throw new Error('Only text documents can be attached to CodeMirror');
    }
    doc = this;
    editorDoc = editor;//.getSession().getDocument();
    //editorDoc.setNewLineMode('unix');
    check = function() {
      return window.setTimeout(function() {
        var editorText, otText;
        editorText = editorDoc.getValue();
        otText = doc.getText();
        if (editorText !== otText) {
          console.error("Text does not match!");
          console.error("editor: " + editorText);
          return console.error("ot:     " + otText);
        }
      }, 0);
    };
    if (keepEditorContents) {
      doc.del(0, doc.getText().length);
      doc.insert(0, editorDoc.getValue());
    } else {
      editorDoc.setValue(doc.getText());
    }
    check();
    suppress = false;
    editorListener = function(change, tc) {
      if (suppress) return;
      applyToShareJS(editorDoc, tc, doc);
      return check();
    };
    editorDoc.setOption("onChange", editorListener);
    docListener = function(op) {
      suppress = true;
      applyToDoc(editorDoc, op);
      suppress = false;
      return check();
    };
    offsetToPos = function(offset) {
      var line, lines, row, _len;
      lineCount = editorDoc.lineCount();
      row = 0;
      for (row = 0, _len = lineCount; row < _len; row++) {
        line = editorDoc.getLine(row);
        if (offset <= line.length) break;
        offset -= line.length + 1;
      }
      return {
        row: row,
        column: offset
      };
    };
    doc.on('insert', function(pos, text) {
      suppress = true;
      start = editorDoc.posFromIndex(pos);
      editorDoc.replaceRange(text,start);
      //editorDoc.insert(offsetToPos(pos), text);
      suppress = false;
      return check();
    });
    doc.on('delete', function(pos, text) {
      var range;
      suppress = true;
      start = editorDoc.posFromIndex(pos); 
      end = editorDoc.posFromIndex(pos + text.length);
      editorDoc.replaceRange("", start, end);
      //range = Range.fromPoints(offsetToPos(pos), offsetToPos(pos + text.length));
      editorDoc.remove(range);
      suppress = false;
      return check();
    });
    doc.detach_codemirror = function() {
      doc.removeListener('remoteop', docListener);
      editorDoc.removeListener('change', editorListener);
      return delete doc.detach_codemirror;
    };
  };

}).call(this);
