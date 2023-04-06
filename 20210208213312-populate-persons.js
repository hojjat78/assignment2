module.exports = {
  async up(db, client) {
    await db
      .collection("persons")
      .insertMany([
        { title: "hojjat" },
        { title: "ali" },
        { title: "hasan" },
        { title: "reza" },
      ]);
  },

  async down(db, client) {
    await db.collection("persons").deleteMany({
      title: {
        $in: ["hojjat", "ali", "hasan", "reza"],
      },
    });
  },
};
