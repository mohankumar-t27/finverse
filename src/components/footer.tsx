'use client';

export default function Footer() {
  return (
    <footer className="w-full flex-shrink-0 border-t border-border/40 py-4 px-4 md:px-6 mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Versetile Technologies Pvt Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
