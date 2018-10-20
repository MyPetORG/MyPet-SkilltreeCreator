import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'mcChat'
})
export class McChatPipe implements PipeTransform {

  transform(value: string): string {
    return value != null ? this.minecraft(this.mypet(value)) : null;
  }

  minecraft(text) {
    let mine = '';
    let styles = ['§l', '§m', '§n', '§o'];
    let colors = ['§0', '§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§a', '§b', '§c', '§d', '§e', '§f'];

    text = text.replace(/[ ]/g, "&nbsp;");
    //text = text.replace("\"", "&quot;");

    let match = text.match(/(§[0-9a-flmnor])/i);

    if (match == null) {
      return text;
    }

    let openColor = null;
    let openStyles = [];
    let pos;
    let generateClasses = function () {
      let classes = openColor != null ? 'mc_style_' + openColor : '';
      for (let i = 0; i < openStyles.length; i++) {
        if (classes != '') {
          classes += ' ';
        }
        classes += 'mc_style_' + openStyles[i];
      }
      return classes;
    };

    let start;
    do {
      pos = text.indexOf(match[1]);

      start = generateClasses();
      let subtext = text.substring(0, pos);

      if (subtext != '') {
        mine += (start != '' ? '<span class="' + generateClasses() + '">' : '') + subtext + (start != '' ? '</span>' : '');
      }


      if (colors.indexOf(match[1]) >= 0) {
        openColor = match[1];
      } else if (styles.indexOf(match[1]) >= 0) {
        if (openStyles.indexOf(match[1]) == -1) {
          openStyles.push(match[1]);
        }
      } else {
        openColor = null;
        openStyles = [];
      }

      text = text.substring(pos + 2);
      match = text.match(/(§[0-9a-flmnor])/i);
    } while (match != null);

    if (text != '') {
      start = generateClasses();
      mine += (start != '' ? '<span class="' + generateClasses() + '">' : '') + text + (start != '' ? '</span>' : '');
    }

    return mine;
  }

  replaceAll = function (text, search, replacement) {
    return text.replace(new RegExp(search, 'g'), replacement);
  };


  mypet(text) {
    let styles = {
      'black': '§0',
      'darkblue': '§1',
      'darkgreen': '§2',
      'darkaqua': '§3',
      'darkred': '§4',
      'darkpurple': '§5',
      'gold': '§6',
      'gray': '§7',
      'darkgray': '§8',
      'blue': '§9',
      'green': '§a',
      'aqua': '§b',
      'red': '§c',
      'lightpurple': '§d',
      'yellow': '§e',
      'white': '§f',
      'bold': '§l',
      'strikethrough': '§m',
      'underline': '§n',
      'italic': '§o',
      'reset': '§r',
      '0': '§0',
      '1': '§1',
      '2': '§2',
      '3': '§3',
      '4': '§4',
      '5': '§5',
      '6': '§6',
      '7': '§7',
      '8': '§8',
      '9': '§9',
      'a': '§a',
      'b': '§b',
      'c': '§c',
      'd': '§d',
      'e': '§e',
      'f': '§d',
      'l': '§l',
      'm': '§m',
      'n': '§n',
      'o': '§o',
      'r': '§r'
    };

    Object.keys(styles).forEach(key => {
      text = this.replaceAll(text, '<' + key + '>', styles[key]);
    });

    return text;
  }
}
