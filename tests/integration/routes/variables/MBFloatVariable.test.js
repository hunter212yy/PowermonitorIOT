const config = require("config");
const request = require("supertest");
const {
  clearDirectoryAsync,
  snooze
} = require("../../../../utilities/utilities");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const {
  testMBVariableCreation,
  testMBVariableEdition
} = require("./utilities");

describe("auth route", () => {
  describe("CREATE /:deviceId/", () => {
    //#region MBFloatVariable

    testMBVariableCreation(
      "MBFloatVariable",
      "float",
      123.321,
      3,
      3,
      16,
      0,
      3,
      16,
      "fakeType",
      "fakeValue",
      1,
      2,
      15
    );

    //#endregion MBFloatVariable
  });

  describe("UPDATE /:deviceId/:variableId", () => {
    //#region MBFloatVariable

    testMBVariableEdition(
      "MBFloatVariable",
      "float",
      123.321,
      3,
      3,
      16,
      321.123,
      4,
      4,
      16,
      0,
      3,
      16,
      "fakeType",
      "fakeValue",
      1,
      2,
      15
    );

    //#endregion MBFloatVariable
  });
});
