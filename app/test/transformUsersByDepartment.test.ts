import axios from "axios";
import { transformUsersByDepartment } from "../services/transformUsersByDepartment";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({
    data: {
      users: [
        {
          firstName: "Alice",
          lastName: "Smith",
          gender: "female",
          age: 30,
          company: { department: "Engineering" },
          hair: { color: "Black" },
          address: { postalCode: "12345" },
        },
        {
          firstName: "Bob",
          lastName: "Jones",
          gender: "male",
          age: 40,
          company: { department: "Engineering" },
          hair: { color: "Brown" },
          address: { postalCode: "67890" },
        },
        {
          firstName: "Carol",
          lastName: "White",
          gender: "female",
          age: 22,
          company: { department: "Marketing" },
          hair: { color: "Blond" },
          address: { postalCode: "99999" },
        },
      ],
    },
  });
});

test("transforms users grouped by department", async () => {
  const result = await transformUsersByDepartment();

  expect(result).toEqual({
    Engineering: {
      male: 1,
      female: 1,
      ageRange: "30-40",
      hair: { Black: 1, Brown: 1 },
      addressUser: {
        AliceSmith: "12345",
        BobJones: "67890",
      }
    },
    Marketing: {
      male: 0,
      female: 1,
      ageRange: "22-22",
      hair: { Blond: 1 },
      addressUser: {
        CarolWhite: "99999",
      },
    },
  });
});
