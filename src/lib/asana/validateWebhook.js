import crypto from "crypto"

const validateWebhook = async (id, body, signature) => {

    let hash = crypto.createHmac('sha256', 'f60f727d088e92587ba2b1736874c2a0').update(body).digest("hex")

    return hash === signature
}

export default validateWebhook
