/* global window FileReader $ */
import Backbone from 'backbone';
import 'backbone-forms';

import 'ace-builds/src-min-noconflict/ace';
//    Chrome Theme
import 'ace-builds/src-min-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/mode-yaml';
import 'ace-builds/src-min-noconflict/mode-javascript';

class CodeEditor extends Backbone.Form.editors.Base {

  constructor(options) {
    super(options);

    this.format = options.schema.format;
    const editor = $('<div></div>');
    this.$el.append(editor);
    this.editor = window.ace.edit(editor.get(0));
    editor.css('height', '300px');
    this.editor.setTheme('ace/theme/chrome');
    this.editor.getSession().setMode('ace/mode/' + this.format);
    this.editor.$blockScrolling = Infinity;
  }

  render() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const fileEl = $('<input type="file"/>');
      fileEl.on('change', evt => {
        const files = evt.target.files;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          this.setValue(text);
        };
        reader.readAsText(file);
      });
      this.$el.append(fileEl);
    }
    if ( this.value === 'null\n') {
      this.value = '';
    }
    this.setValue(this.value);
    return this;
  }

  getValue() {
    return this.editor.getValue();
  }

  setValue(value) {
    if (value) {
      this.editor.setValue(value);
    }
  }

  focus() {
    if (this.hasFocus) {
      return;
    }

    this.$el.focus();
  }

  blur() {
    if (!this.hasFocus) {
      return;
    }

    this.$el.blur();
  }
}

Backbone.Form.editors.CodeEditor = CodeEditor;
