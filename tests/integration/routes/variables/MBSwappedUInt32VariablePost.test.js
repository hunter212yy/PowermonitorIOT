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
    //#region MBSwappedUInt32Variable

    testMBVariableCreation(
      "MBSwappedUInt32Variable",
      "swappedUInt32",
      123,
      3,
      3,
      16,
      0,
      3,
      16,
      "fakeType",
      -1,
      1,
      2,
      15
    );

    //#endregion MBSwappedUInt32Variable
  });
});
