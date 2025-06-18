import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Logo"
        className="mx-auto object-cover mb-2.5"
        width={200}
        height={150}
      />
    </Link>
  );
};

export default Logo;
