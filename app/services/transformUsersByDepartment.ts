import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  hair: {
    color: string;
  };
  address: {
    postalCode: string;
  };
  company: {
    department: string;
  };
}

interface TransformedData {
  [department: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: Record<string, number>;
    addressUser: Record<string, string>;
  };
}

export async function transformUsersByDepartment(): Promise<TransformedData> {
  const res = await axios.get<{ users: User[] }>("https://dummyjson.com/users");
  const users = res.data.users;

  const departmentMap: TransformedData = {};

  for (const user of users) {
    const department = user.company.department;
    const fullName = `${user.firstName}${user.lastName}`;
    const postalCode = user.address.postalCode;
    const gender = user.gender;
    const hairColor = user.hair.color;
    const age = user.age;

    if (!departmentMap[department]) {
      departmentMap[department] = {
        male: 0,
        female: 0,
        ageRange: "",
        hair: {},
        addressUser: {},
      };
    }

    departmentMap[department][gender]++;

    const hairMap = departmentMap[department].hair;
    hairMap[hairColor] = (hairMap[hairColor] || 0) + 1;

    departmentMap[department].addressUser[fullName] = postalCode;
  }

  for (const dept in departmentMap) {
    const deptUsers = users.filter((u) => u.company.department === dept);
    const ages = deptUsers.map((u) => u.age);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    departmentMap[dept].ageRange = `${minAge}-${maxAge}`;
  }

  return departmentMap;
}
