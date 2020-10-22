import fs from "fs";

export const removeImage = (id: string) => {
    const path = `./uploads/${id}`;

    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}