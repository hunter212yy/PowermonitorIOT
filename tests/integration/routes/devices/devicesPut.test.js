const config = require("config");
const request = require("supertest");
const {
  clearDirectoryAsync,
  snooze
} = require("../../../../utilities/utilities");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

describe("devices route", () => {
  //Database directory should be cleared'
  let Project;
  let db1Path;
  let db2Path;
  let projPath;
  let server;
  let endpoint = "/api/devices/";
  let tokenHeader;

  let visuUserBody;
  let operateUserBody;
  let dataAdminBody;
  let superAdminBody;

  let visuUser;
  let operateUser;
  let dataAdmin;
  let superAdmin;

  let PAC3200TCPBody;
  let mbDeviceBody;
  let s7DeviceBody;

  let pac3200TCP;
  let mbDevice;
  let s7Device;

  let mbBooleanVariableBody;
  let mbFloatVariableBody;
  let mbInt32VariableBody;
  let mbUInt32VariableBody;
  let mbInt16VariableBody;
  let mbUInt16VariableBody;
  let mbSwappedFloatVariableBody;
  let mbSwappedInt32VariableBody;
  let mbSwappedUInt32VariableBody;

  let mbBooleanVariable;
  let mbFloatVariable;
  let mbInt32Variable;
  let mbUInt32Variable;
  let mbInt16Variable;
  let mbUInt16Variable;
  let mbSwappedFloatVariable;
  let mbSwappedInt32Variable;
  let mbSwappedUInt32Variable;

  let s7Int8VariableBody;
  let s7Int16VariableBody;
  let s7Int32VariableBody;
  let s7UInt8VariableBody;
  let s7UInt16VariableBody;
  let s7UInt32VariableBody;
  let s7FloatVariableBody;
  let s7ByteArrayVariableBody;

  let s7Int8Variable;
  let s7Int16Variable;
  let s7Int32Variable;
  let s7UInt8Variable;
  let s7UInt16Variable;
  let s7UInt32Variable;
  let s7FloatVariable;
  let s7ByteArrayVariable;

  let init = async () => {
    //Creating additional users
    visuUserBody = {
      login: "visuUser",
      password: "newTestPassword1",
      permissions: 1,
      lang: "pl"
    };
    operateUserBody = {
      login: "opeateUser",
      password: "newTestPassword2",
      permissions: 2,
      lang: "pl"
    };
    dataAdminBody = {
      login: "dataAdminUser",
      password: "newTestPassword3",
      permissions: 4,
      lang: "pl"
    };
    superAdminBody = {
      login: "superAdminUser",
      password: "newTestPassword4",
      permissions: 8,
      lang: "pl"
    };

    let adminToken = await (await Project.CurrentProject.getUser(
      "admin"
    )).generateToken();

    await request(server)
      .post("/api/users")
      .set(tokenHeader, adminToken)
      .send(visuUserBody);
    await request(server)
      .post("/api/users")
      .set(tokenHeader, adminToken)
      .send(operateUserBody);
    await request(server)
      .post("/api/users")
      .set(tokenHeader, adminToken)
      .send(dataAdminBody);
    await request(server)
      .post("/api/users")
      .set(tokenHeader, adminToken)
      .send(superAdminBody);

    visuUser = await Project.CurrentProject.getUser(visuUserBody.login);
    operateUser = await Project.CurrentProject.getUser(operateUserBody.login);
    dataAdmin = await Project.CurrentProject.getUser(dataAdminBody.login);
    superAdmin = await Project.CurrentProject.getUser(superAdminBody.login);

    mbDeviceBody = {
      type: "mbDevice",
      name: "mbDeviceTest",
      ipAdress: "192.168.100.33",
      portNumber: 1001
    };

    PAC3200TCPBody = {
      type: "PAC3200TCP",
      name: "pac3200TCPTest",
      ipAdress: "192.168.100.34"
    };

    s7DeviceBody = {
      type: "s7Device",
      name: "s7DeviceTest",
      ipAdress: "192.168.100.35",
      slot: 1,
      rack: 2,
      timeout: 5000
    };

    let mbDeviceResult = await request(server)
      .post("/api/devices")
      .set(tokenHeader, adminToken)
      .send(mbDeviceBody);
    let pac3200TCPResult = await request(server)
      .post("/api/devices")
      .set(tokenHeader, adminToken)
      .send(PAC3200TCPBody);
    let s7DeviceResult = await request(server)
      .post("/api/devices")
      .set(tokenHeader, adminToken)
      .send(s7DeviceBody);

    mbDevice = await Project.CurrentProject.getDevice(mbDeviceResult.body.id);
    pac3200TCP = await Project.CurrentProject.getDevice(
      pac3200TCPResult.body.id
    );
    s7Device = await Project.CurrentProject.getDevice(s7DeviceResult.body.id);

    mbBooleanVariableBody = {
      type: "mbBoolean",
      name: "mbBooleanVariable",
      archived: false,
      offset: 1,
      fCode: 2
    };

    mbByteArrayVariableBody = {
      type: "mbByteArray",
      name: "mbByteArrayVariable",
      archived: false,
      offset: 3,
      length: 4,
      fCode: 3
    };

    mbInt16VariableBody = {
      type: "mbInt16",
      name: "mbInt16Variable",
      archived: false,
      offset: 10,
      fCode: 3
    };

    mbUInt16VariableBody = {
      type: "mbUInt16",
      name: "mbUInt16Variable",
      archived: false,
      offset: 20,
      fCode: 3
    };

    mbInt32VariableBody = {
      type: "mbInt32",
      name: "mbInt32Variable",
      archived: false,
      offset: 30,
      fCode: 3
    };

    mbUInt32VariableBody = {
      type: "mbUInt32",
      name: "mbUInt32Variable",
      archived: false,
      offset: 40,
      fCode: 3
    };

    mbFloatVariableBody = {
      type: "mbUInt32",
      name: "mbFloatVariable",
      archived: false,
      offset: 50,
      fCode: 3
    };

    mbSwappedInt32VariableBody = {
      type: "mbSwappedInt32",
      name: "mbSwappedInt32Variable",
      archived: false,
      offset: 60,
      fCode: 3
    };

    mbSwappedUInt32VariableBody = {
      type: "mbSwappedUInt32",
      name: "mbSwappedUInt32Variable",
      archived: false,
      offset: 70,
      fCode: 3
    };

    mbSwappedFloatVariableBody = {
      type: "mbSwappedFloat",
      name: "mbSwappedFloatVar",
      archived: false,
      offset: 80,
      fCode: 3
    };

    let booleanResult = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbBooleanVariableBody);

    let byteArrayResult = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbByteArrayVariableBody);

    let int16Result = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbInt16VariableBody);

    let uInt16Result = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbUInt16VariableBody);

    let int32Result = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbInt32VariableBody);

    let uInt32Result = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbUInt32VariableBody);

    let floatResult = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbFloatVariableBody);

    let swappedInt32Result = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbSwappedInt32VariableBody);

    let swappedUInt32Result = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbSwappedUInt32VariableBody);

    let swappedFloatResult = await request(server)
      .post(`/api/variables/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(mbSwappedFloatVariableBody);

    mbBooleanVariable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      booleanResult.body.id
    );

    byteArrayResult = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      byteArrayResult.body.id
    );
    mbInt16Variable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      int16Result.body.id
    );
    mbUInt16Variable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      uInt16Result.body.id
    );
    mbInt32Variable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      int32Result.body.id
    );
    mbUInt32Variable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      uInt32Result.body.id
    );
    mbFloatVariable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      floatResult.body.id
    );
    mbSwappedFloatVariable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      swappedFloatResult.body.id
    );
    mbSwappedInt32Variable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      swappedInt32Result.body.id
    );
    mbSwappedUInt32Variable = await Project.CurrentProject.getVariable(
      mbDevice.Id,
      swappedUInt32Result.body.id
    );

    s7Int8VariableBody = {
      type: "s7Int8",
      name: "s7Int8Variable",
      areaType: "I",
      offset: 0,
      write: false
    };

    s7Int16VariableBody = {
      type: "s7Int16",
      name: "s7Int16Variable",
      areaType: "DB",
      offset: 1,
      dbNumber: 1,
      write: false
    };

    s7Int32VariableBody = {
      type: "s7Int32",
      name: "s7Int32Variable",
      areaType: "Q",
      offset: 0,
      write: false
    };

    s7UInt8VariableBody = {
      type: "s7UInt8",
      name: "s7UInt8Variable",
      areaType: "I",
      offset: 1,
      write: false
    };

    s7UInt16VariableBody = {
      type: "s7UInt16",
      name: "s7UInt16Variable",
      areaType: "M",
      offset: 1,
      write: false
    };

    s7UInt32VariableBody = {
      type: "s7UInt32",
      name: "s7UInt32Variable",
      areaType: "M",
      offset: 3,
      write: false
    };

    s7FloatVariableBody = {
      type: "s7Float",
      name: "s7FloatVariable",
      areaType: "I",
      offset: 3,
      write: false
    };

    s7ByteArrayVariableBody = {
      type: "s7ByteArray",
      name: "s7ByteArrayVariable",
      areaType: "DB",
      offset: 2,
      length: 4,
      dbNumber: 2,
      write: false
    };

    let s7Int8Result = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7Int8VariableBody);

    let s7Int16Result = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7Int16VariableBody);

    let s7Int32Result = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7Int32VariableBody);

    let s7UInt8Result = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7UInt8VariableBody);

    let s7UInt16Result = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7UInt16VariableBody);

    let s7UInt32Result = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7UInt32VariableBody);

    let s7FloatResult = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7FloatVariableBody);

    let s7ByteArrayResult = await request(server)
      .post(`/api/variables/${s7Device.Id}`)
      .set(tokenHeader, adminToken)
      .send(s7ByteArrayVariableBody);

    s7Int8Variable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7Int8Result.body.id
    );

    s7Int16Variable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7Int16Result.body.id
    );

    s7Int32Variable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7Int32Result.body.id
    );

    s7UInt8Variable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7UInt8Result.body.id
    );

    s7UInt16Variable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7UInt16Result.body.id
    );

    s7UInt32Variable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7UInt32Result.body.id
    );

    s7FloatVariable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7FloatResult.body.id
    );

    s7ByteArrayVariable = await Project.CurrentProject.getVariable(
      s7Device.Id,
      s7ByteArrayResult.body.id
    );
  };

  beforeEach(async () => {
    jest.resetModules();

    //Project class has to be reloaded
    Project = require("../../../../classes/project/Project");
    db1Path = config.get("db1Path");
    db2Path = config.get("db2Path");
    projPath = config.get("projPath");
    tokenHeader = config.get("tokenHeader");
    server = await require("../../../../startup/app")();
  });

  afterEach(async () => {
    await clearDirectoryAsync(db1Path);
    await clearDirectoryAsync(db2Path);
    await clearDirectoryAsync(projPath);

    if (Project.CurrentProject.CommInterface.Initialized) {
      //ending communication with all devices if there are any
      await Project.CurrentProject.CommInterface.stopCommunicationWithAllDevices();
      Project.CurrentProject.CommInterface.Sampler.stop();
    }

    await server.close();
  });

  describe("PUT /", () => {
    let body;
    let deviceId;
    let token;
    let mbDeviceBodyCreate;
    let PAC3200TCPBodyCreate;
    let specialDeviceBodyCreate;
    let s7DeviceBodyCreate;

    let mbDeviceBodyEdit;
    let PAC3200TCPBodyEdit;
    let specialDeviceBodyEdit;
    let s7DeviceBodyEdit;

    let editPAC3200;
    let editSpecialDevice;
    let editS7Device;
    let editedDevice;
    let editedDeviceBeforePayload;
    let setFakeDeviceId;

    beforeEach(async () => {
      await init();
      token = await dataAdmin.generateToken();

      mbDeviceBodyCreate = {
        type: "mbDevice",
        name: "mbDeviceNameCreate",
        timeout: 700,
        ipAdress: "192.168.0.101",
        unitId: 3,
        portNumber: 702
      };

      mbDeviceBodyEdit = {
        name: "mbDeviceNameEdit",
        timeout: 702,
        ipAdress: "192.168.100.101",
        unitId: 4,
        portNumber: 302,
        isActive: true
      };

      PAC3200TCPBodyCreate = {
        type: "PAC3200TCP",
        name: "pac3200TCPCreate",
        timeout: 205,
        ipAdress: "192.168.0.105",
        unitId: 5,
        portNumber: 702
      };

      PAC3200TCPBodyEdit = {
        name: "pac3200TCPEdit",
        timeout: 702,
        ipAdress: "192.168.100.106",
        unitId: 7,
        portNumber: 302,
        isActive: true
      };

      specialDeviceBodyCreate = {
        type: "specialDevice",
        name: "specialDeviceCreateName"
      };

      specialDeviceBodyEdit = {
        name: "specialDeviceEditName"
      };

      s7DeviceBodyCreate = {
        type: "s7Device",
        name: "s7DeviceNameCreate",
        timeout: 5000,
        ipAdress: "192.168.0.106",
        rack: 3,
        slot: 6
      };

      s7DeviceBodyEdit = {
        name: "s7DeviceNameEdit",
        timeout: 6000,
        ipAdress: "192.168.100.107",
        rack: 3,
        slot: 6,
        isActive: true
      };

      editPAC3200 = false;
      editSpecialDevice = false;
      editS7Device = false;
      setFakeDeviceId = false;
    });

    let exec = async () => {
      if (editPAC3200) {
        //Editing PAC3200
        editedDevice = await Project.CurrentProject.createDevice(
          PAC3200TCPBodyCreate
        );
        body = PAC3200TCPBodyEdit;
        deviceId = editedDevice.Id;
      } else if (editSpecialDevice) {
        //Editing special device
        editedDevice = await Project.CurrentProject.createDevice(
          specialDeviceBodyCreate
        );

        body = specialDeviceBodyEdit;
        deviceId = editedDevice.Id;
      } else if (editS7Device) {
        //Editing special device
        editedDevice = await Project.CurrentProject.createDevice(
          s7DeviceBodyCreate
        );

        body = s7DeviceBodyEdit;
        deviceId = editedDevice.Id;
      } else {
        //Editing Modbus device
        editedDevice = await Project.CurrentProject.createDevice(
          mbDeviceBodyCreate
        );
        body = mbDeviceBodyEdit;
        deviceId = editedDevice.Id;
      }

      //Setting device id do different value than id of device - to simulate error
      if (setFakeDeviceId) {
        deviceId = "1234";
      }
      editedDeviceBeforePayload = editedDevice.Payload;
      if (token) {
        return request(server)
          .put(`${endpoint}/${deviceId}`)
          .set(tokenHeader, token)
          .send(body);
      } else {
        return request(server)
          .put(`${endpoint}/${deviceId}`)
          .send(body);
      }
    };

    it("should edit mbDevice according to given payload", async () => {
      await exec();

      let editedDevicePayload = {
        name: editedDevice.Name,
        timeout: editedDevice.Timeout,
        ipAdress: editedDevice.IPAdress,
        unitId: editedDevice.UnitId,
        portNumber: editedDevice.PortNumber,
        isActive: editedDevice.IsActive
      };

      expect(editedDevicePayload).toEqual(body);
    });

    it("should return payload of edited mbDevice", async () => {
      let result = await exec();
      let expectedPayload = editedDevice.Payload;
      expectedPayload.connected = editedDevice.Connected;

      expect(result.body).toEqual(expectedPayload);
    });

    it("should edit only name if only name is passed - if device is mbDevice", async () => {
      mbDeviceBodyEdit = _.pick(mbDeviceBodyEdit, "name");

      await exec();

      expect(editedDevice.Name).toEqual(mbDeviceBodyEdit.name);
    });

    it("should edit only timeout if only timeout is passed - if device is mbDevice", async () => {
      mbDeviceBodyEdit = _.pick(mbDeviceBodyEdit, "timeout");

      await exec();

      expect(editedDevice.Timeout).toEqual(mbDeviceBodyEdit.timeout);
    });

    it("should edit only ipAdress if only ipAdress is passed - if device is mbDevice", async () => {
      mbDeviceBodyEdit = _.pick(mbDeviceBodyEdit, "ipAdress");

      await exec();

      expect(editedDevice.IPAdress).toEqual(mbDeviceBodyEdit.ipAdress);
    });

    it("should edit only unitId if only unitId is passed - if device is mbDevice", async () => {
      mbDeviceBodyEdit = _.pick(mbDeviceBodyEdit, "unitId");

      await exec();

      expect(editedDevice.UnitId).toEqual(mbDeviceBodyEdit.unitId);
    });

    it("should edit only portNumber if only portNumber is passed - if device is mbDevice", async () => {
      mbDeviceBodyEdit = _.pick(mbDeviceBodyEdit, "portNumber");

      await exec();

      expect(editedDevice.PortNumber).toEqual(mbDeviceBodyEdit.portNumber);
    });

    it("should edit only isActive if only isActive is passed - if device is mbDevice", async () => {
      mbDeviceBodyEdit = _.pick(mbDeviceBodyEdit, "isActive");

      await exec();

      expect(editedDevice.IsActive).toEqual(mbDeviceBodyEdit.isActive);
    });

    it("should not edit and return 404 if there is no device of given id - if device is mbDevice", async () => {
      setFakeDeviceId = true;
      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(404);
      expect(result.text).toMatch(`Device of given id does not exist`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should not edit and return 401 if there is no user logged in - if device is mbDevice", async () => {
      token = undefined;

      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(401);
      expect(result.text).toMatch(`Access denied. No token provided`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should return code 403 if user does not have dataAdmin rights - if device is mbDevice", async () => {
      token = await visuUser.generateToken();

      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(403);
      expect(result.text).toMatch(`Access forbidden`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should return 400 and not edit device if name is shorter than 3 characters - if device is mbDevice", async () => {
      mbDeviceBodyEdit.name = "ab";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if name is longer than 100 characters - if device is mbDevice", async () => {
      mbDeviceBodyEdit.name = new Array(101 + 1).join("a").toString();

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if timeout is samller than 1 - if device is mbDevice", async () => {
      mbDeviceBodyEdit.timeout = 0;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if timeout is bigger than 10000 - if device is mbDevice", async () => {
      mbDeviceBodyEdit.timeout = 10001;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if ipAdress is not valid adress - if device is mbDevice", async () => {
      mbDeviceBodyEdit.ipAdress = "test.string";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if unitId is samller than 1 - if device is mbDevice", async () => {
      mbDeviceBodyEdit.unitId = 0;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if unitId is bigger than 255 - if device is mbDevice", async () => {
      mbDeviceBodyEdit.unitId = 256;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if portNumber is samller than 1 - if device is mbDevice", async () => {
      mbDeviceBodyEdit.portNumber = 0;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if portNumber is bigger than 100000 - if device is mbDevice", async () => {
      mbDeviceBodyEdit.portNumber = 100001;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if isActive is not valid boolean - if device is mbDevice", async () => {
      mbDeviceBodyEdit.isActive = "string";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should edit PAC3200TCP according to given payload", async () => {
      editPAC3200 = true;

      await exec();

      let editedDevicePayload = {
        name: editedDevice.Name,
        timeout: editedDevice.Timeout,
        ipAdress: editedDevice.IPAdress,
        unitId: editedDevice.UnitId,
        portNumber: editedDevice.PortNumber,
        isActive: editedDevice.IsActive
      };

      expect(editedDevicePayload).toEqual(body);
    });

    it("should return payload of edited PAC3200TCP", async () => {
      editPAC3200 = true;

      let result = await exec();
      let expectedPayload = editedDevice.Payload;
      expectedPayload.connected = editedDevice.Connected;

      expectedPayload.variables = Object.values(editedDevice.Variables).map(
        variable => {
          return { name: variable.Name, id: variable.Id };
        }
      );

      expectedPayload.calculationElements = Object.values(
        editedDevice.CalculationElements
      ).map(element => {
        return { name: element.Name, id: element.Id };
      });

      expect(result.body).toEqual(expectedPayload);
    });

    it("should edit only name if only name is passed - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit = _.pick(PAC3200TCPBodyEdit, "name");

      await exec();

      expect(editedDevice.Name).toEqual(PAC3200TCPBodyEdit.name);
    });

    it("should edit only timeout if only timeout is passed - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit = _.pick(PAC3200TCPBodyEdit, "timeout");

      await exec();

      expect(editedDevice.Timeout).toEqual(PAC3200TCPBodyEdit.timeout);
    });

    it("should edit only ipAdress if only ipAdress is passed - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit = _.pick(PAC3200TCPBodyEdit, "ipAdress");

      await exec();

      expect(editedDevice.IPAdress).toEqual(PAC3200TCPBodyEdit.ipAdress);
    });

    it("should edit only unitId if only unitId is passed - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit = _.pick(PAC3200TCPBodyEdit, "unitId");

      await exec();

      expect(editedDevice.UnitId).toEqual(PAC3200TCPBodyEdit.unitId);
    });

    it("should edit only portNumber if only portNumber is passed - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit = _.pick(PAC3200TCPBodyEdit, "portNumber");

      await exec();

      expect(editedDevice.PortNumber).toEqual(PAC3200TCPBodyEdit.portNumber);
    });

    it("should edit only isActive if only isActive is passed - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit = _.pick(PAC3200TCPBodyEdit, "isActive");

      await exec();

      expect(editedDevice.IsActive).toEqual(PAC3200TCPBodyEdit.isActive);
    });

    it("should not edit and return 404 if there is no device of given id - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      setFakeDeviceId = true;
      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(404);
      expect(result.text).toMatch(`Device of given id does not exist`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should not edit and return 401 if there is no user logged in - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      token = undefined;

      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(401);
      expect(result.text).toMatch(`Access denied. No token provided`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should return code 403 if user does not have dataAdmin rights - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      token = await visuUser.generateToken();

      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(403);
      expect(result.text).toMatch(`Access forbidden`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should return 400 and not edit device if name is shorter than 3 characters - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.name = "ab";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if name is longer than 100 characters - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.name = new Array(101 + 1).join("a").toString();

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if timeout is samller than 1 - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.timeout = 0;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if timeout is bigger than 10000 - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.timeout = 10001;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if ipAdress is not valid adress - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.ipAdress = "test.string";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if unitId is samller than 1 - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.unitId = 0;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if unitId is bigger than 255 - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.unitId = 256;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if portNumber is samller than 1 - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.portNumber = 0;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if portNumber is bigger than 100000 - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.portNumber = 100001;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if isActive is not valid boolean - if device is PAC3200TCP", async () => {
      editPAC3200 = true;

      PAC3200TCPBodyEdit.isActive = "string";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should edit specialDevice according to given payload", async () => {
      editSpecialDevice = true;

      await exec();

      let editedDevicePayload = {
        name: editedDevice.Name
      };

      expect(editedDevicePayload).toEqual(body);
    });

    it("should return payload of edited specialDevice", async () => {
      editSpecialDevice = true;
      let result = await exec();
      let expectedPayload = editedDevice.Payload;
      expectedPayload.connected = editedDevice.Connected;

      expectedPayload.variables = [];

      expectedPayload.calculationElements = [];
      expect(result.body).toEqual(expectedPayload);
    });

    it("should edit only name if only name is passed - if device is specialDevice", async () => {
      editSpecialDevice = true;

      specialDeviceBodyEdit = _.pick(specialDeviceBodyEdit, "name");

      await exec();

      expect(editedDevice.Name).toEqual(specialDeviceBodyEdit.name);
    });

    it("should return 400 and not edit device if name is shorter than 3 characters - if device is specialDevice", async () => {
      editSpecialDevice = true;

      specialDeviceBodyEdit.name = "ab";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if name is longer than 100 characters - if device is specialDevice", async () => {
      editSpecialDevice = true;

      specialDeviceBodyEdit.name = new Array(101 + 1).join("a").toString();

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should edit s7Device according to given payload", async () => {
      editS7Device = true;
      await exec();

      let editedDevicePayload = {
        name: editedDevice.Name,
        timeout: editedDevice.Timeout,
        ipAdress: editedDevice.IPAdress,
        rack: editedDevice.Rack,
        slot: editedDevice.Slot,
        isActive: editedDevice.IsActive
      };

      expect(editedDevicePayload).toEqual(body);
    });

    it("should return payload of edited s7Device", async () => {
      editS7Device = true;
      let result = await exec();
      let expectedPayload = editedDevice.Payload;
      expectedPayload.connected = editedDevice.Connected;

      expect(result.body).toEqual(expectedPayload);
    });

    it("should edit only name if only name is passed - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit = _.pick(s7DeviceBodyEdit, "name");

      await exec();

      expect(editedDevice.Name).toEqual(s7DeviceBodyEdit.name);
    });

    it("should edit only timeout if only timeout is passed - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit = _.pick(s7DeviceBodyEdit, "timeout");

      await exec();

      expect(editedDevice.Timeout).toEqual(s7DeviceBodyEdit.timeout);
    });

    it("should edit only ipAdress if only ipAdress is passed - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit = _.pick(s7DeviceBodyEdit, "ipAdress");

      await exec();

      expect(editedDevice.IPAdress).toEqual(s7DeviceBodyEdit.ipAdress);
    });

    it("should edit only rack if only rack is passed - if device is s7Device", async () => {
      editS7Device = true;
      mbDeviceBodyEdit = _.pick(s7DeviceBodyEdit, "rack");

      await exec();

      expect(editedDevice.Rack).toEqual(s7DeviceBodyEdit.rack);
    });

    it("should edit only slot if only slot is passed - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit = _.pick(s7DeviceBodyEdit, "slot");

      await exec();

      expect(editedDevice.Slot).toEqual(s7DeviceBodyEdit.slot);
    });

    it("should edit only s7Active if only isActive is passed - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit = _.pick(s7DeviceBodyEdit, "isActive");

      await exec();

      expect(editedDevice.IsActive).toEqual(s7DeviceBodyEdit.isActive);
    });

    it("should not edit and return 404 if there is no device of given id - if device is s7Device", async () => {
      editS7Device = true;
      setFakeDeviceId = true;
      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(404);
      expect(result.text).toMatch(`Device of given id does not exist`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should not edit and return 401 if there is no user logged in - if device is s7Device", async () => {
      editS7Device = true;
      token = undefined;

      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(401);
      expect(result.text).toMatch(`Access denied. No token provided`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should return code 403 if user does not have dataAdmin rights - if device is s7Device", async () => {
      editS7Device = true;
      token = await visuUser.generateToken();

      let result = await exec();

      let payloadAfter = editedDevice.Payload;
      expect(result.status).toEqual(403);
      expect(result.text).toMatch(`Access forbidden`);
      expect(editedDeviceBeforePayload).toEqual(payloadAfter);
    });

    it("should return 400 and not edit device if name is shorter than 3 characters - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.name = "ab";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if name is longer than 100 characters - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.name = new Array(101 + 1).join("a").toString();

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if timeout is samller than 3000 - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.timeout = 2500;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if timeout is bigger than 10000 - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.timeout = 10001;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if ipAdress is not valid adress - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.ipAdress = "test.string";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if rack is samller than 0 - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.rack = -1;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if rack is bigger than 255 - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.rack = 256;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if slot is samller than 0 - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.slot = -1;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if slot is bigger than 255 - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.slot = 256;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });

    it("should return 400 and not edit device if isActive is not valid boolean - if device is s7Device", async () => {
      editS7Device = true;
      s7DeviceBodyEdit.isActive = "string";

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(editedDeviceBeforePayload).toEqual(editedDevice.Payload);
    });
  });
});
