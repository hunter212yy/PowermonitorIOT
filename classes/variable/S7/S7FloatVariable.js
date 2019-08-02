const S7Variable = require("./S7Variable");

//Converting register array to Int32
const s7DataToFloat = function(data) {
  var buf = new ArrayBuffer(4);

  var view = new DataView(buf);

  view.setUint8(0, data[0]);
  view.setUint8(1, data[1]);
  view.setUint8(2, data[2]);
  view.setUint8(3, data[3]);

  return view.getFloat32(0);
};

//Converting Int32 to register array
const floatToS7Data = function(intValue) {
  //Split int32 into bytes
  let int32Array = new Float32Array(1);
  int32Array[0] = intValue;
  let bytes = new Uint8Array(int32Array.buffer);

  return [bytes[3], bytes[2], bytes[1], bytes[0]];
};

class S7FloatVariable extends S7Variable {
  /**
   * @description Modbus Int16 variable
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
    payload.length = 4;
    await super.init(payload);
  }

  /**
   * @description Method for generating type name that represents variable
   */
  _getTypeName() {
    return "s7Float";
  }

  /**
   * @description method for converting data to value
   * @param {Array} data array of UInt16 representing data
   */
  _convertDataToValue(data) {
    return s7DataToFloat(data);
  }

  /**
   * @description method for converting value to data
   * @param {number} value value  to be converted
   */
  _convertValueToData(value) {
    return floatToS7Data(value);
  }

  /**
   * @description Method for edditing variable
   * @param {Object} payload Payload to edit
   */
  async editWithPayload(payload) {
    payload.length = 4;

    return super.editWithPayload(payload);
  }

  /**
   * @description Method for generating type of value of variable
   */
  _getValueType() {
    return "float";
  }
}

module.exports = S7FloatVariable;
