module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Activity', {
    storyType:   DataTypes.STRING,
    title:       DataTypes.STRING,
    status:      DataTypes.STRING,
    ownedBy:     DataTypes.STRING,
    requestedBy: DataTypes.STRING,
    createdAt:   DataTypes.DATE,
    updatedAt:   DataTypes.DATE
  }, {
    timestamps: false
  })
}
