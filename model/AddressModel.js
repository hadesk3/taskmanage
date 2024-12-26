import mongoose from "mongoose";
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    street_address1: { type: String, required: true },
    street_address2: { type: String, required: false },
    company_name: { type: String, required: false },
    town_city: { type: String, required: true },
    country: { type: String, required: true },
    pin_code: { type: String, required: true }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;