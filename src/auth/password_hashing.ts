import bcrypt from "bcrypt";

const PEPPER = process.env.PASSWORD_PEPPER; 
const SALT_ROUNDS = 10; 

export async function hashPassword(password: string): Promise<string> {
    // Combine password with pepper before hashing
    const pepperedPassword = password + PEPPER;

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
        const pepperedPassword = plainPassword + PEPPER;

        // Compare the peppered plain password with the hashed password
        const isMatch = await bcrypt.compare(pepperedPassword, hashedPassword);

        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
}
