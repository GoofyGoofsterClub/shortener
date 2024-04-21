export function GeneratePrivateID(length: number = 32, salt: string = "")
{
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        salt += possible.charAt(Math.floor(Math.random() * possible.length));

    return salt;
}

export function GeneratePublicID(length: number = 16, salt:string = ".~")
{
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        salt += possible.charAt(Math.floor(Math.random() * possible.length));

    return salt;
}