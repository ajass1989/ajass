# Turborepo starter

This is an official starter turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-prisma
```

## What's inside?

This turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `@repo/database`: [Prisma](https://prisma.io/) ORM wrapper to manage & access your database
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Prisma](https://prisma.io/) for database ORM
- [Docker Compose](https://docs.docker.com/compose/) for local database

### Database

We use [Prisma](https://prisma.io/) to manage & access our database. As such you will need a database for this project, either locally or hosted in the cloud.

To make this process easier, we offer a [`docker-compose.yml`](https://docs.docker.com/compose/) file to deploy a MySQL server locally with a new database named `turborepo` (To change this update the `MYSQL_DATABASE` environment variable in the `docker-compose.yml` file):

```bash
cd my-turborepo
docker-compose up -d
```

Once deployed you will need to copy the `.env.example` file to `.env` in order for Prisma to have a `DATABASE_URL` environment variable to access.

```bash
cp .env.example .env
```

If you added a custom database name, or use a cloud based database, you will need to update the `DATABASE_URL` in your `.env` accordingly.

Once deployed & up & running, you will need to create & deploy migrations to your database to add the necessary tables. This can be done using [Prisma Migrate](https://www.prisma.io/migrate):

```bash
npx prisma migrate dev
```

If you need to push any existing migrations to the database, you can use either the Prisma db push or the Prisma migrate deploy command(s):

```bash
yarn run db:push

# OR

yarn run db:migrate:deploy
```

There is slight difference between the two commands & [Prisma offers a breakdown on which command is best to use](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push#choosing-db-push-or-prisma-migrate).

An optional additional step is to seed some initial or fake data to your database using [Prisma's seeding functionality](https://www.prisma.io/docs/guides/database/seed-database).

To do this update check the seed script located in `packages/database/src/seed.ts` & add or update any users you wish to seed to the database.

Once edited run the following command to run tell Prisma to run the seed script defined in the Prisma configuration:

```bash
yarn run db:seed
```

For further more information on migrations, seeding & more, we recommend reading through the [Prisma Documentation](https://www.prisma.io/docs/).

### Build

To build all apps and packages, run the following command:

```bash
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```bash
yarn run dev
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

# TODO

- ~~シニアとジュニアの年齢入力に制限を加える~~
- ~~チームや選手削除時のポイント再計算~~
- ~~bib編集時のポイント再計算~~
  - ~~つまり、ポイント計算は様々な影響を受けるため、都度更新をすべきか要検討~~
- 業務フローの考慮
  - チーム編集確定→bib付与→結果入力となるべき、
- 結果閲覧機能の検討
  - ~~種目ごと（総合、男子、女子、スキー男子、スキー女子、スノボ男子、スノボ女子、シニア、ジュニア）~~
  - ~~チームごと~~
  - ビブ指定
- ~~チーム情報のCSVファイル読み込み~~
- ~~帳票出力~~
  - ~~シニアとジュニアの特別表示列を追加する~~
- ~~状態でds,df,dq入力時に記録は消さない（誤入力により結果が消える恐れがある）~~
- ~~状態を空にした際に記録は消さない（誤入力により結果が消える恐れがある）~~
- ビブ未割り当ての競技者がいる状態でポイント編集させない
  - ポイント計算ができない状況がありうるので
- ~~団体ポイントの表示不具合~~
- ~~ポイント向こう競技者の背景色を薄く~~
- ~~シニアの年齢補正表示（画面側）の修正~~
- ~~ジュニア選手を削除した後、チーム編集画面上から全選手が消える~~
  - ~~背景色が意図しないものになるケースがある~~
- シードを数字入力したくなるケースがある
  - 締切後の追加エントリーはシードとしては一番最後になるため
- ビブ未割り当ての選手がいる状態でポイント一括付与するとエラーになりそう
- ~~一括追加でフォーマット異常のファイルを指定したときのエラーメッセージ表示が不十分~~
