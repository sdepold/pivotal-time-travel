module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Activity', {
    storyType:   DataTypes.STRING,
    title:       DataTypes.STRING,
    status:      DataTypes.STRING,
    ownedBy:     DataTypes.STRING,
    requestedBy: DataTypes.STRING,
    labels:      DataTypes.STRING,
    createdAt:   DataTypes.DATE,
    updatedAt:   DataTypes.DATE,
    startedAt:   {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    timestamps: false,
    instanceMethods: {
      getLabels: function() {
        return this.labels ? this.labels.split(',') : []
      }
    }
  })
}
