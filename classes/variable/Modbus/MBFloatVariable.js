const MBVariable = require("./MBVariable");

//Converting register array to float
const mbDataToFloat = function(mbData) {
  //Split 2 x 16 bit to bytes
  let int16Array = new Uint16Array(2);
  int16Array[0] = mbData[1];
  int16Array[1] = mbData[0];
  let bytes = new Int8Array(int16Array.buffer);

  //Bytes swap
  let data = [bytes[1], bytes[0], bytes[3], bytes[2]];

  // Create a buffer
  var buf = new ArrayBuffer(4);
  // Create a data view of it
  var view = new DataView(buf);

  // set bytes
  data.forEach(function(b, i) {
    view.setUint8(i, b);
  });

  // Read the bits as a float; note that by doing this, we're implicitly
  // converting it from a 32-bit float into JavaScript's native 64-bit double
  var num = view.getFloat32(0);

  return num;
};

//Converting float to register array
const floatToMBData = function(floatValue) {
  //Split float into bytes
  let floatArray = new Float32Array(1);
  floatArray[0] = floatValue;
  let bytes = new Int8Array(floatArray.buffer);

  //swap bytes
  let int1Buf = [bytes[3], bytes[2]];

  // Create a buffer
  var buf1 = new ArrayBuffer(4);
  // Create a data view of it
  var view1 = new DataView(buf1);

  // set bytes
  int1Buf.forEach(function(b, i) {
    view1.setUint8(i, b);
  });

  let int1 = view1.getUint16(0);

  //swap bytes
  let int2Buf = [bytes[1], bytes[0]];

  // Create a buffer
  var buf2 = new ArrayBuffer(4);
  // Create a data view of it
  var view2 = new DataView(buf2);

  // set bytes
  int2Buf.forEach(function(b, i) {
    view2.setUint8(i, b);
  });

  let int2 = view2.getUint16(0);

  return [int2, int1];
};

class MBFloatVariable extends MBVariable {
  /**
   * @description Modbus Float variable
   * @param {Object} device Device associated with variable
   */
  constructor(device) {
    super(device);
  }

  /**
   * @description Method for initializing variable by payload
   * @param {object} payload variable payload
   */
  async init(payload) {
    if (!payload) throw new Error("Payload cannot be empty");
    payload.length = 2;
    payload.setSingleFCode = 16;
    //Setting alwyas function 3 in case given fcode is write option - fcode 16
    payload.getSingleFCode =
      payload.fCode === 3 || payload.fCode == 4 ? payload.fCode : 3;

    await super.init(payload);
  }

  /**
   * @description Method for generating type name that represents variable
   */
  _getTypeName() {
    return "mbFloat";
  }

  /**
   * @description method for converting data to value
   * @param {Array} data array of UInt16 representing data
   */
  _convertDataToValue(data) {
    return mbDataToFloat(data);
  }

  /**
   * @description method for converting value to data
   * @param {number} value value  to be converted
   */
  _convertValueToData(value) {
    return floatToMBData(value);
  }

  /**
   * @description Private method called for getting all possible FCodes - implemented in child
   */
  _getPossibleFCodes() {
    return [3, 4, 16];
  }

  /**
   * @description Method for edditing variable
   * @param {Object} payload Payload to edit
   */
  editWithPayload(payload) {
    payload.length = 2;
    let fCode = this.FCode;
    if (payload.fCode) fCode = payload.fCode;

    payload.setSingleFCode = 16;
    //Setting alwyas function 3 in case given fcode is write option - fcode 16
    payload.getSingleFCode = fCode === 3 || fCode == 4 ? fCode : 3;
    return super.editWithPayload(payload);
  }

  /**
   * @description Method for generating type of value of variable
   */
  _getValueType() {
    return "float";
  }
}

module.exports = MBFloatVariable;
