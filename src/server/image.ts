import fs from "fs";

// delete an image stored into /uploads
export const removeImage = (id: string) => {
    const path = `./uploads/${id}`;

    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}