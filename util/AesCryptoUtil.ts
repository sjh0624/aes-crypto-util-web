import CryptoJS from "crypto-js";

export namespace AesCryptoUtil {

    export function decrypt(encryptedValue: string, secretKey: string) {
        const decodedByteArray = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));
        const ivByteArray = new Uint8Array(decodedByteArray.buffer.slice(0,16));
        const cipherTextByteArray = new Uint8Array(decodedByteArray.buffer.slice(16));

        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.lib.WordArray.create(cipherTextByteArray as unknown as number[])
        });

        const keyEnc = CryptoJS.enc.Utf8.parse(secretKey);

        const decrypted = CryptoJS.AES.decrypt(cipherParams, keyEnc, {
            iv: CryptoJS.lib.WordArray.create(ivByteArray as unknown as number[]),
            mode: CryptoJS.mode.CBC
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

}
