const config = require("config");
const request = require("supertest");
const {
  clearDirectoryAsync,
  snooze
} = require("../../../../utilities/utilities");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

describe("events route", () => {
  //Database directory should be cleared'
  let Project;
  let db1Path;
  let db2Path;
  let projPath;
  let server;
  let endpoint = "/api/events/";
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

  let pac3200TCP;
  let mbDevice;

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

  let averageElementBody;
  let factorElementBody;
  let increaseElementBody;
  let sumElementBody;
  let eventLogBody;

  let averageElement;
  let factorElement;
  let increaseElement;
  let sumElement;
  let eventLog;

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

    let mbDeviceResult = await request(server)
      .post("/api/devices")
      .set(tokenHeader, adminToken)
      .send(mbDeviceBody);
    let pac3200TCPResult = await request(server)
      .post("/api/devices")
      .set(tokenHeader, adminToken)
      .send(PAC3200TCPBody);

    mbDevice = await Project.CurrentProject.getDevice(mbDeviceResult.body.id);
    pac3200TCP = await Project.CurrentProject.getDevice(
      pac3200TCPResult.body.id
    );

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
      fCode: 3,
      value: 12345
    };

    mbUInt16VariableBody = {
      type: "mbUInt16",
      name: "mbUInt16Variable",
      archived: false,
      offset: 20,
      fCode: 3,
      value: 1
    };

    mbInt32VariableBody = {
      type: "mbInt32",
      name: "mbInt32Variable",
      archived: false,
      offset: 30,
      fCode: 3,
      value: 12346
    };

    mbUInt32VariableBody = {
      type: "mbUInt32",
      name: "mbUInt32Variable",
      archived: false,
      offset: 40,
      fCode: 3,
      value: 2
    };

    mbFloatVariableBody = {
      type: "mbFloat",
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
      fCode: 3,
      value: 12347
    };

    mbSwappedUInt32VariableBody = {
      type: "mbSwappedUInt32",
      name: "mbSwappedUInt32Variable",
      archived: false,
      offset: 70,
      fCode: 3,
      value: 3
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

    mbByteArrayVariable = await Project.CurrentProject.getVariable(
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

    averageElementBody = {
      type: "averageElement",
      name: "averageElementTest",
      sampleTime: 2,
      unit: "A",
      archived: false,
      variableId: mbFloatVariable.Id,
      factor: 3,
      calculationInterval: 15
    };

    factorElementBody = {
      type: "factorElement",
      name: "factorElementTest",
      sampleTime: 3,
      unit: "A",
      archived: false,
      variableId: mbFloatVariable.Id,
      factor: 3
    };

    increaseElementBody = {
      type: "increaseElement",
      name: "increaseElementTest",
      sampleTime: 2,
      unit: "A",
      archived: false,
      variableId: mbFloatVariable.Id,
      factor: 3,
      calculationInterval: 15,
      overflow: 100
    };

    sumElementBody = {
      type: "sumElement",
      name: "sumElementTest",
      sampleTime: 3,
      unit: "A",
      archived: false,
      variables: [
        {
          id: mbFloatVariable.Id,
          factor: 2
        },
        {
          id: mbInt16Variable.Id,
          factor: 3
        },
        {
          id: mbInt32Variable.Id,
          factor: 4
        }
      ]
    };

    eventLogBody = {
      type: "eventLogElement",
      name: "eventLog",
      logVariables: [
        {
          tickVarId: mbSwappedInt32Variable.Id,
          valueVarId: mbSwappedUInt32Variable.Id
        },
        {
          tickVarId: mbInt32Variable.Id,
          valueVarId: mbUInt32Variable.Id
        },
        {
          tickVarId: mbInt16Variable.Id,
          valueVarId: mbUInt16Variable.Id
        }
      ],
      eventDescriptions: {
        "1": "event 1",
        "2": "event 2",
        "3": "event 3"
      }
    };

    let averageElementResult = await request(server)
      .post(`/api/calcElements/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(averageElementBody);

    let factorElementResult = await request(server)
      .post(`/api/calcElements/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(factorElementBody);

    let increaseElementResult = await request(server)
      .post(`/api/calcElements/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(increaseElementBody);

    let sumElementResult = await request(server)
      .post(`/api/calcElements/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(sumElementBody);

    let eventLogResult = await request(server)
      .post(`/api/calcElements/${mbDevice.Id}`)
      .set(tokenHeader, adminToken)
      .send(eventLogBody);

    averageElement = await Project.CurrentProject.getCalcElement(
      mbDevice.Id,
      averageElementResult.body.id
    );

    factorElement = await Project.CurrentProject.getCalcElement(
      mbDevice.Id,
      factorElementResult.body.id
    );

    increaseElement = await Project.CurrentProject.getCalcElement(
      mbDevice.Id,
      increaseElementResult.body.id
    );

    sumElement = await Project.CurrentProject.getCalcElement(
      mbDevice.Id,
      sumElementResult.body.id
    );

    eventLog = await Project.CurrentProject.getCalcElement(
      mbDevice.Id,
      eventLogResult.body.id
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

  describe("GET /:deviceId/:elementId", () => {
    let token;
    let deviceId;
    let variableId;
    let variablePayload;
    let variable;
    let initEventValues;
    let timestamp;

    beforeEach(async () => {
      await init();
      token = await visuUser.generateToken();
      deviceId = mbDevice.Id;
      variableId = eventLog.Id;
      initEventValues = true;
      timestamp = 12346;
    });

    let exec = async () => {
      //Refreshing in order for values of varaibles to load
      if (initEventValues) await eventLog.refresh();

      if (token) {
        return request(server)
          .get(`${endpoint}/${deviceId}/${variableId}?timestamp=${timestamp}`)
          .set(tokenHeader, token)
          .send();
      } else {
        return request(server)
          .get(`${endpoint}/${deviceId}/${variableId}?timestamp=${timestamp}`)
          .send();
      }
    };

    it("should return code 200 and valid payload of event for given timestamp", async () => {
      let result = await exec();

      expect(result.status).toEqual(200);

      let expectedPayload = {
        [mbInt32Variable.Value]: eventLog.Descriptions[mbUInt32Variable.Value]
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return code 200 and valid payload of event for given timestamp - if event value is not presented in descriptions", async () => {
      mbUInt32Variable.Value = 1234;

      let result = await exec();

      expect(result.status).toEqual(200);

      let expectedPayload = {
        [mbInt32Variable.Value]: mbUInt32Variable.Value
      };

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return code 200 and valid payload of event for given timestamp - if there is no events", async () => {
      initEventValues = false;

      let result = await exec();

      expect(result.status).toEqual(200);

      let expectedPayload = {};

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return code 200 and valid payload of event for given timestamp - if there is no event for given timestamp", async () => {
      timestamp = 10;

      let result = await exec();

      expect(result.status).toEqual(200);

      let expectedPayload = {};

      expect(result.body).toEqual(expectedPayload);
    });

    it("should return code 404 if there is no device of given id", async () => {
      deviceId = "4321";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toMatch(`There is no device`);
    });

    it("should return code 404 if there is no calcElement of given id", async () => {
      variableId = "4321";

      let result = await exec();

      expect(result.status).toEqual(404);
      expect(result.text).toMatch(`There is no element`);
    });

    it("should return code 401 if there is no user logged in", async () => {
      token = undefined;

      let result = await exec();

      expect(result.status).toEqual(401);
      expect(result.text).toMatch(`Access denied. No token provided`);
    });

    it("should return code 403 if user does not have visu rights", async () => {
      token = await operateUser.generateToken();

      let result = await exec();

      expect(result.status).toEqual(403);
      expect(result.text).toMatch(`Access forbidden`);
    });

    it("should return code 400 if given id is not id of eventLog", async () => {
      variableId = mbFloatVariable.Id;

      let result = await exec();

      expect(result.status).toEqual(400);
      expect(result.text).toMatch(
        `Element of type mbFloat does not have events`
      );
    });
  });
});
