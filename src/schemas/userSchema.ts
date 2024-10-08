import { z } from 'zod';

export const registerSchema = z.object({
  nameofUser: z.string().min(1, { message: "Tên không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  phone: z
  .string()
  .regex(/^[0-9]{10,13}$/, { message: "Số điện thoại không hợp lệ" })
  .optional(),

  gender: z.enum(['male', 'female', 'other']),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});



export const createByAdminSchema = z.object({
  nameofUser: z.string().min(1, { message: "Tên không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  phone: z
    .string()
    .regex(/^[0-9]{10,13}$/, { message: "Số điện thoại không hợp lệ" })
    .optional(),
  gender: z.enum(['male', 'female', 'other'])
});