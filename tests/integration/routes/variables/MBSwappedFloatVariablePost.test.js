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

describe("variables route", () => {
  describe("CREATE /:deviceId/", () => {
    //#region MBSwappedFloatVariable

    testMBVariableCreation(
      "MBSwappedFloatVariable",
      "mbSwappedFloat",
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

    //#endregion MBSwappedFloatVariable
  });
});
