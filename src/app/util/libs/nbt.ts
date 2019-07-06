import * as pako from 'pako';

export class NBT {

  public static TAG_TYPES = {
    'end': 0,
    'byte': 1,
    'short': 2,
    'int': 3,
    'long': 4,
    'float': 5,
    'double': 6,
    'byteArray': 7,
    'string': 8,
    'list': 9,
    'compound': 10,
    'intArray': 11
  };

  public static TAG_TYPE_NAMES = [
    'end',
    'byte',
    'short',
    'int',
    'long',
    'float',
    'double',
    'byteArray',
    'string',
    'list',
    'compound',
    'intArray'
  ];

  static hasGzipHeader(data) {
    const head = new Uint8Array(data.slice(0, 2));
    return head.length === 2 && head[0] === 0x1f && head[1] === 0x8b;
  }

  static decodeUTF8(array) {
    const codepoints = [];
    for (let i = 0; i < array.length; i++) {
      if ((array[i] & 0x80) === 0) {
        codepoints.push(array[i] & 0x7F);
      } else if (i + 1 < array.length &&
        (array[i] & 0xE0) === 0xC0 &&
        (array[i + 1] & 0xC0) === 0x80) {
        codepoints.push(
          ((array[i] & 0x1F) << 6) |
          (array[i + 1] & 0x3F));
      } else if (i + 2 < array.length &&
        (array[i] & 0xF0) === 0xE0 &&
        (array[i + 1] & 0xC0) === 0x80 &&
        (array[i + 2] & 0xC0) === 0x80) {
        codepoints.push(
          ((array[i] & 0x0F) << 12) |
          ((array[i + 1] & 0x3F) << 6) |
          (array[i + 2] & 0x3F));
      } else if (i + 3 < array.length &&
        (array[i] & 0xF8) === 0xF0 &&
        (array[i + 1] & 0xC0) === 0x80 &&
        (array[i + 2] & 0xC0) === 0x80 &&
        (array[i + 3] & 0xC0) === 0x80) {
        codepoints.push(
          ((array[i] & 0x07) << 18) |
          ((array[i + 1] & 0x3F) << 12) |
          ((array[i + 2] & 0x3F) << 6) |
          (array[i + 3] & 0x3F));
      }
    }
    return String.fromCharCode.apply(null, codepoints);
  }

  static sliceUint8Array(array, begin, end) {
    if ('slice' in array) {
      return array.slice(begin, end);
    } else {
      return new Uint8Array([].slice.call(array, begin, end));
    }
  }

  static parseUncompressed(data) {
    if (!data) {
      throw new Error('Argument "data" is falsy');
    }

    const reader = new Reader(data);

    const type = reader.byte();
    if (type !== NBT.TAG_TYPES.compound) {
      throw new Error('Top tag should be a compound');
    }

    return {
      name: reader.string(),
      value: reader.compound()
    };
  };

  static parse(data, callback) {
    if (!data) {
      throw new Error('Argument "data" is falsy');
    }

    if (!NBT.hasGzipHeader(data)) {
      callback(null, this.parseUncompressed(data));
    } else {
      let buffer;
      if (data.length) {
        buffer = data;
      } else {
        buffer = new Uint8Array(data);
      }

      try {
        const uncompressed = pako.inflate(buffer);
        callback(null, NBT.parseUncompressed(uncompressed));
      } catch (error) {
        callback(error, null);
      }
    }
  }
}

class Reader {

  offset = 0;
  arrayView;
  dataView;

  constructor(buffer) {
    if (!buffer) {
      throw new Error('Invalid "buffer"');
    }

    this.arrayView = new Uint8Array(buffer);
    this.dataView = new DataView(this.arrayView.buffer);

  }

  read(dataType, size) {
    const val = this.dataView['get' + dataType](this.offset);
    this.offset += size;
    return val;
  }

  byte = this.read.bind(this, 'Int8', 1);
  ubyte = this.read.bind(this, 'Uint8', 1);
  short = this.read.bind(this, 'Int16', 2);
  int = this.read.bind(this, 'Int32', 4);
  float = this.read.bind(this, 'Float32', 4);
  double = this.read.bind(this, 'Float64', 8);

  long() {
    return [this.int(), this.int()];
  }

  byteArray() {
    const length = this.int();
    const bytes = [];
    for (let i = 0; i < length; i++) {
      bytes.push(this.byte());
    }
    return bytes;
  }

  intArray() {
    const length = this.int();
    const ints = [];
    for (let i = 0; i < length; i++) {
      ints.push(this.int());
    }
    return ints;
  }

  string() {
    const length = this.short();
    const slice = NBT.sliceUint8Array(this.arrayView, this.offset,
      this.offset + length);
    this.offset += length;
    return NBT.decodeUTF8(slice);
  }

  list() {
    const type = this.byte();
    const length = this.int();
    const values = [];
    for (let i = 0; i < length; i++) {
      values.push(this[NBT.TAG_TYPE_NAMES[type]]());
    }
    return { type: NBT.TAG_TYPE_NAMES[type], value: values };
  }

  compound() {
    const values = {};
    let type, name, value;
    while (true) {
      type = this.byte();
      if (type === NBT.TAG_TYPES.end) {
        break;
      }
      name = this.string();
      value = this[NBT.TAG_TYPE_NAMES[type]]();
      values[name] = { type: NBT.TAG_TYPE_NAMES[type], value: value };
    }
    return values;
  }
}
