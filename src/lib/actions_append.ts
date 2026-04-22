export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.parent.delete({ where: { id } });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createGrade = async (
  currentState: CurrentState,
  data: GradeSchema
) => {
  try {
    await prisma.grade.create({ data: { level: data.level } });
    // revalidatePath("/list/grades");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateGrade = async (
  currentState: CurrentState,
  data: GradeSchema
) => {
  if (!data.id) return { success: false, error: true };
  try {
    await prisma.grade.update({
      where: { id: data.id },
      data: { level: data.level },
    });
    // revalidatePath("/list/grades");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteGrade = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.grade.delete({ where: { id: parseInt(id) } });
    // revalidatePath("/list/grades");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
