import { getMaxVote } from "@/actions/MaxVote";
import { auth } from "@/auth";
import AvatarDemo from "@/components/avatar";
import { LoginButton } from "@/components/LoginButton";
import { LogoutButton } from "@/components/LogoutButton";
import { db } from "@/db";
import Image from "next/image";
export default async function ProfilePage() {
  const badgeres = await db.query(`Select *from badges`);
  const badges = badgeres.rows;
  const session = await auth();
  const userId = session?.user?.id;

  const res = db.query(`SELECT * FROM users WHERE id =$1`, [userId]);
  const user = (await res).rows[0];
  // console.log(user);
  if (!user) {
    return (
      <>
        <p className="font-mono text-red-500">Please Login First</p>
        <LoginButton />
      </>
    );
  }
  const postResponse = await db.query(`Select * from posts where user_id=$1`, [
    session.user?.id,
  ]);
  const userPosts = postResponse.rows;
  const postsCount = postResponse.rowCount;

  const num = await getMaxVote(session.user?.id);
  let isBadge = false;
  let check = 0;
  if (num > 1 && num < 8) {
    isBadge = true;
    check = badges[0].name;
  } else if (num > 8 && num < 17) {
    isBadge = true;
    check = badges[1].name;
  } else {
    isBadge = false;
  }
  console.log(num);

  return (
    <>
      <div className="flex flex-row items-center gap-2 mt-2 ml-2 font-mono text-pink-600">
        <AvatarDemo src={user.image} />
        <p>username : {user.name}</p>
      </div>
      <div className="p-4 bg-blue-200 text-blue-700 font-semibold rounded-md">
        <p>posts Count: {`${postsCount}`} </p>
      </div>
      <div className="p-4 bg-blue-100 text-blue-700 font-semibold rounded-md">
        <p> most positive post: {`${num}`}</p>
      </div>

      {check && (
        <div className="p-4 bg-blue-200 text-red-700 font-semibold rounded-md">{`Current Badge: ${check}`}</div>
      )}
      <div className="p-4 bg-blue-100 text-blue-700 font-semibold rounded-md">
        <LogoutButton />
      </div>
    </>
  );
}
