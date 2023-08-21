const {
  availableDeliveryDates,
  isGreenDelivery,
  daysLeftInTheWeek,
} = require("./index");

describe("availableDeliveryDates", () => {
  it("should throw an error if the postal code is not provided", () => {
    const products = [
      {
        productId: 1,
        name: "Widget",
        deliveryDays: [1, 2, 3, 4, 5],
        productType: "external",
        daysInAdvance: 3,
      },
    ];

    expect(() =>
      availableDeliveryDates(null, products, new Date("2023-08-21"))
    ).toThrowError("Postal code is required");
  });

  it("should throw an error if the products are not provided", () => {
    expect(() =>
      availableDeliveryDates(13756, null, new Date("2023-08-21"))
    ).toThrowError("Products are required");
  });

  it("should throw an error if the date is not provided", () => {
    const products = [
      {
        productId: 1,
        name: "Widget",
        deliveryDays: [1, 2, 3, 4, 5],
        productType: "external",
        daysInAdvance: 3,
      },
    ];
    expect(() => availableDeliveryDates(13756, products, null)).toThrowError(
      "Date is required"
    );
  });

  it("should throw an error if the date is not a valid date", () => {
    const products = [
      {
        productId: 1,
        name: "Widget",
        deliveryDays: [1, 2, 3, 4, 5],
        productType: "external",
        daysInAdvance: 3,
      },
    ];
    expect(() =>
      availableDeliveryDates(13756, products, "2023-08-200")
    ).toThrowError("The provided date is missing or invalid");
  });

  it("should should give a 5 day gap for external products", () => {
    const products = [
      {
        productId: 1,
        name: "Apple",
        deliveryDays: [1, 2, 3, 4, 5],
        productType: "external",
        daysInAdvance: 3,
      },
    ];
    const result = availableDeliveryDates(
      14162,
      products,
      new Date("2023-08-21")
    );
    const expectedDeliveryDates = [
      {
        postalCode: 14162,
        deliveryDate: "2023-08-28T00:00:00.000Z",
        isGreenDelivery: false,
      },
      {
        postalCode: 14162,
        deliveryDate: "2023-08-29T00:00:00.000Z",
        isGreenDelivery: false,
      },
      {
        postalCode: 14162,
        deliveryDate: "2023-08-30T00:00:00.000Z",
        isGreenDelivery: true,
      },
      {
        postalCode: 14162,
        deliveryDate: "2023-08-31T00:00:00.000Z",
        isGreenDelivery: false,
      },
      {
        postalCode: 14162,
        deliveryDate: "2023-09-01T00:00:00.000Z",
        isGreenDelivery: false,
      },
    ];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedDeliveryDates));
  });
});
describe("isGreenDelivery", () => {
  it("should return true for green days of the week", () => {
    const date = new Date("2023-08-23");
    expect(isGreenDelivery(date)).toBe(true);
  });

  it("should return true for dates in green days of the months", () => {
    const date = new Date("2023-08-05");
    expect(isGreenDelivery(date)).toBe(true);
  });

  it("should return false for dates not in green days of the week or month", () => {
    const date = new Date("2023-08-01");
    expect(isGreenDelivery(date)).toBe(false);
  });
});

describe("daysLeftInTheWeek", () => {
  it("should return 6 for Sunday", () => {
    const date = new Date("2023-08-20");
    expect(daysLeftInTheWeek(date)).toBe(6);
  });

  it("should return 5 for Monday", () => {
    const date = new Date("2023-08-21");
    expect(daysLeftInTheWeek(date)).toBe(5);
  });

  it("should return 4 for Tuesday", () => {
    const date = new Date("2023-08-22");
    expect(daysLeftInTheWeek(date)).toBe(4);
  });

  it("should return 3 for Wednesday", () => {
    const date = new Date("2023-08-23");
    expect(daysLeftInTheWeek(date)).toBe(3);
  });

  it("should return 2 for Thursday", () => {
    const date = new Date("2023-08-24");
    expect(daysLeftInTheWeek(date)).toBe(2);
  });

  it("should return 1 for Friday", () => {
    const date = new Date("2023-08-25");
    expect(daysLeftInTheWeek(date)).toBe(1);
  });

  it("should return 0 for Saturday", () => {
    const date = new Date("2023-08-26");
    expect(daysLeftInTheWeek(date)).toBe(0);
  });
});
