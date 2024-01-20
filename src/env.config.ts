interface databaseInterface {
  host: string;
  port: number;
  name: string;
  user: string;
  pass: string;
}
interface jwtInterface {
  secret: string;
}
interface envInterface {
  dev: boolean;
}

interface configInterface {
  database: databaseInterface;
  jwt: jwtInterface;
  env: envInterface;
}

const config: configInterface = {
  database: {
    host: process.env.DB_HOST,
    port: 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  env: {
    dev: true,
  },
};
export { config };
