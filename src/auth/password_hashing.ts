import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    // Combine password with pepper before hashing
    const pepperedPassword = password + process.env.PASSWORD_PEPPER;

    // Hash the peppered password
    const hashedPassword = await bcrypt.hash(pepperedPassword, SALT_ROUNDS);

    return hashedPassword;
}

export async function comparePassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        // Add the pepper to the plain password
        const pepperedPassword = plainPassword + process.env.PASSWORD_PEPPER;

        // Compare the peppered plain password with the hashed password
        const isMatch = await bcrypt.compare(pepperedPassword, hashedPassword);

        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
}
