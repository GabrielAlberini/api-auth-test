import z from "zod";

const userSchema = z.object({
  username: z.string(),
  mail: z.string().email(),
  password: z.string().min(4).max(12),
});

const validateUser = (obj: any) => userSchema.safeParse(obj);

const validatePartialUser = (obj: any) => userSchema.partial().safeParse(obj);

export { validateUser, validatePartialUser };
