const mongoose =  require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['global', 'group', 'user', 'magasin'],
    required: true
  },
  targetGroup: {
    type: String,
    enum: ['users', 'magasins'],
    required: function() {
      return this.targetType === 'group';
    }
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.targetType === 'user';
    }
  },
  targetMagasin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Magasin',
    required: function() {
      return this.targetType === 'magasin';
    }
  },
  payload: {
    type: Object
  },
  type : {
    type: String,
    required: true,
    enum: ["reschedule", "success", "failure", "info"]
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps:true
})

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification