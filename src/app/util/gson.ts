import * as XRegExp from 'xregexp'

export const GSON = (() => {
  let _json;
  let _pos;
  let _len;

  function peekRegex(regex) {
    return XRegExp.exec(_json, regex, _pos, true);
  }

  function eatRegex(regex) {
    let match = peekRegex(regex);

    if (!match) {
      return false;
    }

    _pos += match[0].length;

    return match[0];
  }

  function peekChar() {
    return _json[_pos];
  }

  function eatChar(c) {
    if (peekChar() !== c) {
      return false;
    }
    return !!(_pos++);
  }

  function skipWhitespace() {
    while (true) {
      switch (peekChar()) {
        case ' ':
        case '\t':
        case '\r':
        case '\n':
          ++_pos;
          continue;
      }
      break;
    }
  }

  let _strict;
  let _depth;

  const _startObject = /{/;
  const _endObject = /}/;

  const _startArray = /\[/;
  const _endArray = /]/;

  const _colon = /:/;
  const _comma = /,/;

  const _null = /null/;
  const _boolean = /true|false/;
  const _number = /-?(0|[1-9][0-9]*)(\.[0-9]+)?(e[+-]?[0-9]+)?([df])?/i;

  const _stringBoundary = /"/;
  const _stringEscape = /\\/;
  const _controlCharacter = /["\\/bfnrtu]/;
  const _controlUnicode = /[0-9a-f]{4}/i;

  const _lenientSemicolon = /;/;
  const _lenientNonExecutePrefix = /\)]}'\n/;
  const _lenientNaNOrInfinite = /NaN|-?Infinity/;
  const _lenientStringBoundary = /["']/;
  const _lenientControlCharacter = /['"\\/bfnrtu]/;
  const _lenientKeyValueSeparator = /(:)|(=>)|(=)/;
  const _lenientCommentsGlobal = /(?:(?:(?:\/\/)|#).*$)|(?:\/\*[\s\S]*?\*\/)/mg;
  const _lenientStringStart = /[a-z_$]/i;

  function _error(str) {
    throw new Error('[index ' + _pos + '] ' + str);
  }

  function _checkUndefined(char) {
    if (char == undefined) {
      return "nothing"
    }
    return char;
  }

  function _parseString() {
    skipWhitespace();

    let str = '';
    let boundary;

    // "Strings that are unquoted or 'single quoted'."
    if (!_strict) {
      if ((boundary = eatRegex(_lenientStringBoundary)) === false) {
        boundary = null;
      }
    }
    else {
      if ((boundary = eatRegex(_stringBoundary)) === false) {
        _error('expected ", got ' + _checkUndefined(peekChar()));
      }
    }

    let stringContainer;

    if (boundary) {
      stringContainer = new RegExp('[^' + boundary + '\\\\]*');
    } else {
      stringContainer = new RegExp('\\w*');
    }

    while (true) {
      let grp = eatRegex(stringContainer);

      if (grp !== false) {
        str += grp;
      }

      if (boundary === null || eatChar(boundary)) {
        break;
      } else if (eatRegex(_stringEscape)) {
        let ctrl = eatRegex(!_strict ? _lenientControlCharacter : _controlCharacter);

        if (ctrl === false) {
          _error('expected valid control character, got ' + _checkUndefined(peekChar()));
        }

        switch (ctrl) {
          case '\'': // not strict (accept single quotes)

          case '"':
          case '\\':
          case '/':
            str += ctrl;
            break;
          case 'b':
            str += '\b';
            break;
          case 'f':
            str += '\f';
            break;
          case 'n':
            str += '\n';
            break;
          case 'r':
            str += '\r';
            break;
          case 't':
            str += '\t';
            break;
          case 'u':
            let hex = eatRegex(_controlUnicode);

            if (hex === false) {
              _error('expected valid 4-character hex number, got ' + _checkUndefined(peekChar()));
            }

            str += String.fromCharCode(parseInt(hex, 16));
            break;
        }
      }
      else {
        _error('expected " or \\, got ' + _checkUndefined(peekChar()));
      }
    }
    return str;
  }

  function _parseObject() {
    skipWhitespace();

    if (eatRegex(_startObject) === false) {
      _error('expected {, got ' + _checkUndefined(peekChar()));
    }

    let obj = {};

    while (true) {
      skipWhitespace();

      if (eatRegex(_endObject)) {
        break;
      }

      let key = _parseString();

      skipWhitespace();

      // "Names and values separated by = or => instead of :."
      if (!_strict) {
        if (eatRegex(_lenientKeyValueSeparator) === false) {
          _error('expected =, => or :, got ' + _checkUndefined(peekChar()));
        }
      }
      else if (eatRegex(_colon) === false) {
        _error('expected :, got ' + _checkUndefined(peekChar()));
      }

      let value = _parseAny();
      obj[key] = value;

      skipWhitespace();

      if (eatRegex(_comma)) {
        continue;
      }// "Name/value pairs separated by ; instead of ,."
      else if (!_strict && eatRegex(_lenientSemicolon)) {
        continue;
      } else if (!eatRegex(_endObject)) {
        _error('expected }, got ' + _checkUndefined(peekChar()));
      }

      break;
    }
    return obj;
  }

  function _parseArray() {
    skipWhitespace();

    if (eatRegex(_startArray) === false) {
      _error('expected [, got ' + _checkUndefined(peekChar()));
    }

    let arr = [];

    while (true) {
      // todo: "Unnecessary array separators. These are interpreted as if null was the omitted value."
      skipWhitespace();

      if (eatRegex(_endArray)) {
        break;
      }

      let value = _parseAny();
      arr.push(value);

      skipWhitespace();

      if (eatRegex(_comma)) {
        continue;
      }// "Array elements separated by ; instead of ,."
      else if (!_strict && eatRegex(_lenientSemicolon)) {
        continue;
      } else if (!eatRegex(_endArray)) {
        _error('expected ], got ' + _checkUndefined(peekChar()));
      }

      break;
    }
    return arr;
  }

  function _parseNumber() {
    let str;

    if ((str = eatRegex(_number)) === false) {
      // "Numbers may be NaNs or infinities."
      if (!_strict) {
        if ((str = eatRegex(_lenientNaNOrInfinite)) !== false) {
          return Number(str);
        }
      }

      _error('expected number, got ' + _checkUndefined(peekChar()));
    }
    return Number(str);
  }

  function _parseBoolean() {
    let str;

    if ((str = eatRegex(_boolean)) === false) {
      _error('expected boolean, got' + peekChar());
    }
    return str === "true";
  }

  function _parseNull() {
    if (eatRegex(_null) === false) {
      _error('expected null, got ' + _checkUndefined(peekChar()));
    }
    return null;
  }

  function _parseAny() {
    skipWhitespace();

    if (peekRegex(_startObject)) {
      return _parseObject();
    } else if (peekRegex(_startArray)) {
      return _parseArray();
    } else if (peekRegex(_number) || (!_strict && peekRegex(_lenientNaNOrInfinite))) {
      return _parseNumber();
    } else if (peekRegex(_boolean)) {
      return _parseBoolean();
    } else if (peekRegex(_null)) {
      return _parseNull();
    } else if (peekRegex(_stringBoundary) || (!_strict && (peekRegex(_lenientStringBoundary) || peekRegex(_lenientStringStart)))) {
      return _parseString();
    }

    _error('expected ANY, got ' + _checkUndefined(peekChar()));
  }

  function _parseObjectOrArray() {
    skipWhitespace();

    if (peekRegex(_startObject)) {
      return _parseObject();
    } else if (peekRegex(_startArray)) {
      return _parseArray();
    }

    _error('expected object or array, got ' + _checkUndefined(peekChar()));
  }

  function parse(json, strict = false) {
    if (strict === undefined) {
      strict = false;
    }

    _strict = strict;
    _depth = 0;

    if (!strict) {
      _json = json.replace(_lenientCommentsGlobal, '');
    }// Single-line comments (// or #) and block-comments (/* */)
    else {
      _json = json;
    }
    _pos = 0;
    _len = json.length;

    // "Streams that start with the non-execute prefix, ")]}'\n"."
    if (!_strict) {
      eatRegex(_lenientNonExecutePrefix);
    }

    // "Top-level values of any type. With strict parsing, the top-level value must be an object or an array."
    if (!_strict) {
      return _parseAny();
    }

    // todo: "Streams that include multiple top-level values. With strict parsing, each stream must contain exactly one top-level value."
    return _parseObjectOrArray();
  }

  // STRINGIFY CODE
  let _options;
  let _str;

  function _opt(name, def) {
    if (!_options || _options[name] === undefined) {
      return def;
    }
    return _options[name];
  }

  function _validKey(key) {
    try {
      eval("let " + key + ";");
      return true;
    }
    catch (e) {
      return false;
    }
  }

  function _stringifyNull() {
    _str += 'null';
  }

  function _stringifyObject(object) {
    // start object
    _str += '{';

    // properties
    let props = Object.getOwnPropertyNames(object);

    // options used
    let keyPairSeparator = _opt('keyPairSeparator', ':');

    for (let i = 0; i < props.length; ++i) {
      if (i !== 0) {
        _str += ',';
      }

      _stringifyString(props[i], true);
      _str += keyPairSeparator;
      _stringifyAny(object[props[i]]);
    }

    // end object
    _str += '}';
  }

  function _stringifyArray(array) {
    // start array
    _str += '[';

    // options used
    let arraySeparator = _opt('arraySeparator', ',');

    for (let i = 0; i < array.length; ++i) {
      if (i !== 0) {
        _str += arraySeparator;
      }

      _stringifyAny(array[i]);
    }

    // end array
    _str += ']';
  }

  function _stringifyNumber(number) {
    // options used
    let allowNaNInfinite = _opt('allowNaNInfinite', false);

    if (!allowNaNInfinite && (isNaN(number) || !isFinite(number))) {
      _stringifyNull();
      return;
    }

    _str += number.toString();
  }

  function _stringifyBoolean(bool) {
    _str += (bool) ? 'true' : 'false';
  }

  function _fixString(str) {
    return str
      .replace('\\', '\\\\')
      .replace("\b", "\\b")
      .replace("\f", "\\f")
      .replace("\n", "\\n")
      .replace("\r", "\\r")
      .replace("\t", "\\t")
      .replace("\v", "\\v");
  }

  function _stringifyString(input, isKey) {
    let unquotedKeys, preferSingleQuotedKeys;

    if (isKey) {
      unquotedKeys = _opt('unquotedKeys', false);
      preferSingleQuotedKeys = _opt('preferSingleQuotedKeys', false);
    }
    else {
      unquotedKeys = _opt('unquotedStrings', false);
      preferSingleQuotedKeys = _opt('preferSingleQuotedStrings', false);
    }

    let output = null;

    if (unquotedKeys && _validKey(input))
    // see if the key is a valid identifier, if so use it raw.
    {
      output = input;
    } else if (preferSingleQuotedKeys) {
      // can use single-quoted keys, find the best candidate
      let dq = input.indexOf('"') !== -1;
      let sq = input.indexOf("'") !== -1;

      // for having both or only double quotes, use single.
      if ((dq && sq) || dq) {
        output = "'" + _fixString(input).replace("'", "\\'") + "'";
      }
    }

    if (output === null) {
      output = '"' + _fixString(input).replace('"', '\\"') + '"';
    }

    _str += output;
  }

  function _stringifyAny(object) {
    if (object === null) {
      _stringifyNull();
      return;
    }

    switch (Object.prototype.toString.call(object)) {
      case '[object Object]':
        _stringifyObject(object);
        return;
      case '[object Array]':
        _stringifyArray(object);
        return;
      case '[object Number]':
        _stringifyNumber(object);
        return;
      case '[object Boolean]':
        _stringifyBoolean(object);
        return;
      case '[object String]':
      default:
        _stringifyString(object, false);
        return;
    }
  }

  function stringify(object, options) {
    if (options === false)
    // if options is "false", act like parses' "strict"
    {
      options = {unquotedKeys: true, unquotedStrings: true, allowNaNInfinite: true};
    }

    _str = '';
    _options = options;

    _stringifyAny(object);

    // copy so that global _str is cleared. ugly?
    let copy = _str;
    _str = null;
    return copy;
  }

  return {
    parse: parse,
    stringify: stringify
  };
})();
