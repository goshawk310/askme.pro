execve("/usr/bin/sudo", ["sudo", "-u", "askme", "pm2", "start", "prod.json"], [/* 25 vars */]) = 0
brk(0)                                  = 0x7f7c5c838000
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a767000
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
open("/etc/ld.so.cache", O_RDONLY)      = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=32717, ...}) = 0
mmap(NULL, 32717, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f7c5a750000
close(3)                                = 0
open("/lib64/libaudit.so.1", O_RDONLY)  = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\260%\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=113096, ...}) = 0
mmap(NULL, 2208304, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c5a320000
mprotect(0x7f7c5a337000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5a536000, 24576, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x16000) = 0x7f7c5a536000
close(3)                                = 0
open("/lib64/libselinux.so.1", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0PX\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=122040, ...}) = 0
mmap(NULL, 2221912, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c5a100000
mprotect(0x7f7c5a11d000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5a31c000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x1c000) = 0x7f7c5a31c000
mmap(0x7f7c5a31e000, 1880, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a31e000
close(3)                                = 0
open("/lib64/libutil.so.1", O_RDONLY)   = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\20\16\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=14584, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a78a000
mmap(NULL, 2105600, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c59ef8000
mprotect(0x7f7c59efa000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5a0f9000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x1000) = 0x7f7c5a0f9000
close(3)                                = 0
open("/lib64/libdl.so.2", O_RDONLY)     = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\340\r\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=19536, ...}) = 0
mmap(NULL, 2109696, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c59cf0000
mprotect(0x7f7c59cf2000, 2097152, PROT_NONE) = 0
mmap(0x7f7c59ef2000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x2000) = 0x7f7c59ef2000
close(3)                                = 0
open("/lib64/libc.so.6", O_RDONLY)      = 3
read(3, "\177ELF\2\1\1\3\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0000\356\1\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=1921216, ...}) = 0
mmap(NULL, 3750152, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c59958000
mprotect(0x7f7c59ae3000, 2093056, PROT_NONE) = 0
mmap(0x7f7c59ce2000, 20480, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x18a000) = 0x7f7c59ce2000
mmap(0x7f7c59ce7000, 18696, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c59ce7000
close(3)                                = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a789000
mmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a787000
arch_prctl(ARCH_SET_FS, 0x7f7c5a7877a0) = 0
mprotect(0x7f7c59ce2000, 16384, PROT_READ) = 0
mprotect(0x7f7c59ef2000, 4096, PROT_READ) = 0
mprotect(0x7f7c5a0f9000, 4096, PROT_READ) = 0
mprotect(0x7f7c5a31c000, 4096, PROT_READ) = 0
mprotect(0x7f7c5a536000, 4096, PROT_READ) = 0
mprotect(0x7f7c5a984000, 4096, PROT_READ) = 0
mprotect(0x7f7c5a75f000, 4096, PROT_READ) = 0
munmap(0x7f7c5a750000, 32717)           = 0
statfs("/selinux", {f_type="EXT2_SUPER_MAGIC", f_bsize=4096, f_blocks=6929457, f_bfree=6169357, f_bavail=5817357, f_files=1761280, f_ffree=1662839, f_fsid={-1286879270, -190535251}, f_namelen=255, f_frsize=4096}) = 0
brk(0)                                  = 0x7f7c5c838000
brk(0x7f7c5c859000)                     = 0x7f7c5c859000
open("/proc/filesystems", O_RDONLY)     = 3
fstat(3, {st_mode=S_IFREG|0444, st_size=0, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "nodev\tsysfs\nnodev\trootfs\nnodev\tb"..., 1024) = 342
read(3, "", 1024)                       = 0
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
open("/usr/lib/locale/locale-archive", O_RDONLY) = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=99158576, ...}) = 0
mmap(NULL, 99158576, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f7c53ac0000
close(3)                                = 0
geteuid()                               = 0
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
fcntl(0, F_GETFL)                       = 0x8002 (flags O_RDWR|O_LARGEFILE)
fcntl(1, F_GETFL)                       = 0x8002 (flags O_RDWR|O_LARGEFILE)
fcntl(2, F_GETFL)                       = 0x8001 (flags O_WRONLY|O_LARGEFILE)
stat("/etc/sudo.conf", {st_mode=S_IFREG|0640, st_size=1786, ...}) = 0
open("/etc/sudo.conf", O_RDONLY)        = 3
fstat(3, {st_mode=S_IFREG|0640, st_size=1786, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "#\n# Default /etc/sudo.conf file\n"..., 4096) = 1786
read(3, "", 4096)                       = 0
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
getpid()                                = 14362
getppid()                               = 14361
getpgid(0)                              = 14361
open("/dev/tty", O_RDWR|O_NOCTTY|O_NONBLOCK) = 3
ioctl(3, TIOCGPGRP, [14361])            = 0
close(3)                                = 0
getsid(0)                               = 13494
getuid()                                = 0
geteuid()                               = 0
getgid()                                = 0
getegid()                               = 0
socket(PF_FILE, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = 3
connect(3, {sa_family=AF_FILE, path="/var/run/nscd/socket"}, 110) = -1 ENOENT (No such file or directory)
close(3)                                = 0
socket(PF_FILE, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = 3
connect(3, {sa_family=AF_FILE, path="/var/run/nscd/socket"}, 110) = -1 ENOENT (No such file or directory)
close(3)                                = 0
open("/etc/nsswitch.conf", O_RDONLY)    = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=1688, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "#\n# /etc/nsswitch.conf\n#\n# An ex"..., 4096) = 1688
read(3, "", 4096)                       = 0
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
open("/etc/ld.so.cache", O_RDONLY)      = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=32717, ...}) = 0
mmap(NULL, 32717, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f7c5a750000
close(3)                                = 0
open("/lib64/libnss_files.so.2", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\360!\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=65928, ...}) = 0
mmap(NULL, 2151824, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c538b0000
mprotect(0x7f7c538bc000, 2097152, PROT_NONE) = 0
mmap(0x7f7c53abc000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0xc000) = 0x7f7c53abc000
close(3)                                = 0
mprotect(0x7f7c53abc000, 4096, PROT_READ) = 0
munmap(0x7f7c5a750000, 32717)           = 0
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 3
fcntl(3, F_GETFD)                       = 0x1 (flags FD_CLOEXEC)
fstat(3, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
getgroups(0, NULL)                      = 1
getgroups(1, [0])                       = 1
getcwd("/home/askme/www/askme.pro", 4096) = 26
open("/proc/14362/stat", O_RDONLY)      = 3
fstat(3, {st_mode=S_IFREG|0444, st_size=0, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "14362 (sudo) R 14361 14361 13494"..., 1024) = 235
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
stat("/dev/console", {st_mode=S_IFCHR|0600, st_rdev=makedev(5, 1), ...}) = 0
stat("/dev/wscons", 0x7fff396597b0)     = -1 ENOENT (No such file or directory)
stat("/dev/pts/2", {st_mode=S_IFCHR|0620, st_rdev=makedev(136, 2), ...}) = 0
uname({sys="Linux", node="n2.askme.pro", ...}) = 0
ioctl(2, TIOCGWINSZ, 0x7fff3965b870)    = -1 ENOTTY (Inappropriate ioctl for device)
socket(PF_NETLINK, SOCK_RAW, 0)         = 3
bind(3, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 0
getsockname(3, {sa_family=AF_NETLINK, pid=14362, groups=00000000}, [12]) = 0
sendto(3, "\24\0\0\0\22\0\1\3\365\360EV\0\0\0\0\0\0\0\0", 20, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 20
recvmsg(3, {msg_name(12)={sa_family=AF_NETLINK, pid=0, groups=00000000}, msg_iov(1)=[{"\350\3\0\0\20\0\2\0\365\360EV\0328\0\0\0\0\4\3\1\0\0\0I\0\1\0\0\0\0\0"..., 4096}], msg_controllen=0, msg_flags=0}, 0) = 2008
recvmsg(3, {msg_name(12)={sa_family=AF_NETLINK, pid=0, groups=00000000}, msg_iov(1)=[{"\24\0\0\0\3\0\2\0\365\360EV\0328\0\0\0\0\0\0\1\0\0\0I\0\1\0\0\0\0\0"..., 4096}], msg_controllen=0, msg_flags=0}, 0) = 20
sendto(3, "\24\0\0\0\26\0\1\3\366\360EV\0\0\0\0\0\0\0\0", 20, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 20
recvmsg(3, {msg_name(12)={sa_family=AF_NETLINK, pid=0, groups=00000000}, msg_iov(1)=[{"0\0\0\0\24\0\2\0\366\360EV\0328\0\0\2\10\200\376\1\0\0\0\10\0\1\0\177\0\0\1"..., 4096}], msg_controllen=0, msg_flags=0}, 0) = 108
recvmsg(3, {msg_name(12)={sa_family=AF_NETLINK, pid=0, groups=00000000}, msg_iov(1)=[{"@\0\0\0\24\0\2\0\366\360EV\0328\0\0\n\200\200\376\1\0\0\0\24\0\1\0\0\0\0\0"..., 4096}], msg_controllen=0, msg_flags=0}, 0) = 128
recvmsg(3, {msg_name(12)={sa_family=AF_NETLINK, pid=0, groups=00000000}, msg_iov(1)=[{"\24\0\0\0\3\0\2\0\366\360EV\0328\0\0\0\0\0\0\1\0\0\0\24\0\1\0\0\0\0\0"..., 4096}], msg_controllen=0, msg_flags=0}, 0) = 20
close(3)                                = 0
stat("/usr/libexec/sudoers.so", {st_mode=S_IFREG|0755, st_size=291784, ...}) = 0
open("/usr/libexec/sudoers.so", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0 h\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=291784, ...}) = 0
mmap(NULL, 2399208, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c53660000
mprotect(0x7f7c536a4000, 2097152, PROT_NONE) = 0
mmap(0x7f7c538a4000, 12288, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x44000) = 0x7f7c538a4000
mmap(0x7f7c538a7000, 11240, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c538a7000
close(3)                                = 0
open("/etc/ld.so.cache", O_RDONLY)      = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=32717, ...}) = 0
mmap(NULL, 32717, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f7c5a750000
close(3)                                = 0
open("/lib64/libpam.so.0", O_RDONLY)    = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\320#\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=55848, ...}) = 0
mmap(NULL, 2150944, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c53450000
mprotect(0x7f7c5345c000, 2097152, PROT_NONE) = 0
mmap(0x7f7c5365c000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0xc000) = 0x7f7c5365c000
close(3)                                = 0
open("/lib64/libldap-2.4.so.2", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0P\347\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=314240, ...}) = 0
mmap(NULL, 2409496, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c53200000
mprotect(0x7f7c53249000, 2097152, PROT_NONE) = 0
mmap(0x7f7c53449000, 16384, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x49000) = 0x7f7c53449000
close(3)                                = 0
open("/lib64/libcrypt.so.1", O_RDONLY)  = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\0\f\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=40400, ...}) = 0
mmap(NULL, 2318816, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c52fc8000
mprotect(0x7f7c52fcf000, 2097152, PROT_NONE) = 0
mmap(0x7f7c531cf000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x7000) = 0x7f7c531cf000
mmap(0x7f7c531d1000, 184800, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c531d1000
close(3)                                = 0
open("/lib64/liblber-2.4.so.2", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\3005\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=60512, ...}) = 0
mmap(NULL, 2155816, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c52db8000
mprotect(0x7f7c52dc6000, 2093056, PROT_NONE) = 0
mmap(0x7f7c52fc5000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0xd000) = 0x7f7c52fc5000
close(3)                                = 0
open("/lib64/libresolv.so.2", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\00009\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=110960, ...}) = 0
mmap(NULL, 2202248, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c52b98000
mprotect(0x7f7c52bae000, 2097152, PROT_NONE) = 0
mmap(0x7f7c52dae000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x16000) = 0x7f7c52dae000
mmap(0x7f7c52db0000, 6792, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c52db0000
close(3)                                = 0
open("/usr/lib64/libssl3.so", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\300\253\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=250168, ...}) = 0
mmap(NULL, 2347568, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c52958000
mprotect(0x7f7c52991000, 2097152, PROT_NONE) = 0
mmap(0x7f7c52b91000, 16384, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x39000) = 0x7f7c52b91000
mmap(0x7f7c52b95000, 560, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c52b95000
close(3)                                = 0
open("/usr/lib64/libsmime3.so", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0P\235\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=181168, ...}) = 0
mmap(NULL, 2276448, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c52728000
mprotect(0x7f7c52750000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5294f000, 20480, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x27000) = 0x7f7c5294f000
close(3)                                = 0
open("/usr/lib64/libnss3.so", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\360\226\1\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=1296368, ...}) = 0
mmap(NULL, 3397480, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c523e8000
mprotect(0x7f7c5251d000, 2097152, PROT_NONE) = 0
mmap(0x7f7c5271d000, 28672, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x135000) = 0x7f7c5271d000
mmap(0x7f7c52724000, 5992, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c52724000
close(3)                                = 0
open("/usr/lib64/libnssutil3.so", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\220\275\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=179416, ...}) = 0
mmap(NULL, 2275920, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c521b8000
mprotect(0x7f7c521dd000, 2097152, PROT_NONE) = 0
mmap(0x7f7c523dd000, 28672, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x25000) = 0x7f7c523dd000
close(3)                                = 0
open("/lib64/libplds4.so", O_RDONLY)    = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\20\17\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=14560, ...}) = 0
mmap(NULL, 2109776, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c51fb0000
mprotect(0x7f7c51fb3000, 2093056, PROT_NONE) = 0
mmap(0x7f7c521b2000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x2000) = 0x7f7c521b2000
close(3)                                = 0
open("/lib64/libplc4.so", O_RDONLY)     = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\20\24\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=18720, ...}) = 0
mmap(NULL, 2113912, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c51da8000
mprotect(0x7f7c51dac000, 2093056, PROT_NONE) = 0
mmap(0x7f7c51fab000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x3000) = 0x7f7c51fab000
close(3)                                = 0
open("/lib64/libnspr4.so", O_RDONLY)    = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\360\317\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=240560, ...}) = 0
mmap(NULL, 2346240, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c51b68000
mprotect(0x7f7c51ba1000, 2093056, PROT_NONE) = 0
mmap(0x7f7c51da0000, 12288, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x38000) = 0x7f7c51da0000
mmap(0x7f7c51da3000, 7424, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c51da3000
close(3)                                = 0
open("/usr/lib64/libsasl2.so.2", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\340F\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=106160, ...}) = 0
mmap(NULL, 2201520, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c51948000
mprotect(0x7f7c51961000, 2093056, PROT_NONE) = 0
mmap(0x7f7c51b60000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x18000) = 0x7f7c51b60000
close(3)                                = 0
open("/usr/lib64/libfreebl3.so", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0@<\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=469528, ...}) = 0
mmap(NULL, 2582368, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c516d0000
mprotect(0x7f7c51741000, 2093056, PROT_NONE) = 0
mmap(0x7f7c51940000, 12288, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x70000) = 0x7f7c51940000
mmap(0x7f7c51943000, 14176, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c51943000
close(3)                                = 0
open("/lib64/libpthread.so.0", O_RDONLY) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\340]\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=142640, ...}) = 0
mmap(NULL, 2212848, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c514b0000
mprotect(0x7f7c514c7000, 2097152, PROT_NONE) = 0
mmap(0x7f7c516c7000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x17000) = 0x7f7c516c7000
mmap(0x7f7c516c9000, 13296, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c516c9000
close(3)                                = 0
open("/lib64/libz.so.1", O_RDONLY)      = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0 !\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=88600, ...}) = 0
mmap(NULL, 2183696, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c51298000
mprotect(0x7f7c512ad000, 2093056, PROT_NONE) = 0
mmap(0x7f7c514ac000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x14000) = 0x7f7c514ac000
close(3)                                = 0
open("/lib64/librt.so.1", O_RDONLY)     = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0@!\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=43832, ...}) = 0
mmap(NULL, 2128816, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7c51090000
mprotect(0x7f7c51097000, 2093056, PROT_NONE) = 0
mmap(0x7f7c51296000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x6000) = 0x7f7c51296000
close(3)                                = 0
mprotect(0x7f7c51296000, 4096, PROT_READ) = 0
mprotect(0x7f7c514ac000, 4096, PROT_READ) = 0
mprotect(0x7f7c516c7000, 4096, PROT_READ) = 0
mprotect(0x7f7c51940000, 8192, PROT_READ) = 0
mprotect(0x7f7c51b60000, 4096, PROT_READ) = 0
mprotect(0x7f7c51da0000, 4096, PROT_READ) = 0
mprotect(0x7f7c51fab000, 4096, PROT_READ) = 0
mprotect(0x7f7c521b2000, 4096, PROT_READ) = 0
mprotect(0x7f7c523dd000, 24576, PROT_READ) = 0
mprotect(0x7f7c5271d000, 20480, PROT_READ) = 0
mprotect(0x7f7c5294f000, 16384, PROT_READ) = 0
mprotect(0x7f7c52b91000, 12288, PROT_READ) = 0
mprotect(0x7f7c52dae000, 4096, PROT_READ) = 0
mprotect(0x7f7c52fc5000, 4096, PROT_READ) = 0
mprotect(0x7f7c531cf000, 4096, PROT_READ) = 0
mprotect(0x7f7c53449000, 8192, PROT_READ) = 0
mprotect(0x7f7c5365c000, 4096, PROT_READ) = 0
mprotect(0x7f7c538a4000, 4096, PROT_READ) = 0
set_tid_address(0x7f7c5a787a70)         = 14362
set_robust_list(0x7f7c5a787a80, 0x18)   = 0
futex(0x7fff3965b35c, FUTEX_WAKE_PRIVATE, 1) = 0
futex(0x7fff3965b35c, FUTEX_WAIT_BITSET_PRIVATE|FUTEX_CLOCK_REALTIME, 1, NULL, 7f7c5a7877a0) = -1 EAGAIN (Resource temporarily unavailable)
rt_sigaction(SIGRTMIN, {0x7f7c514b5c60, [], SA_RESTORER|SA_SIGINFO, 0x7f7c514bf710}, NULL, 8) = 0
rt_sigaction(SIGRT_1, {0x7f7c514b5cf0, [], SA_RESTORER|SA_RESTART|SA_SIGINFO, 0x7f7c514bf710}, NULL, 8) = 0
rt_sigprocmask(SIG_UNBLOCK, [RTMIN RT_1], NULL, 8) = 0
getrlimit(RLIMIT_STACK, {rlim_cur=10240*1024, rlim_max=RLIM_INFINITY}) = 0
munmap(0x7f7c5a750000, 32717)           = 0
stat("/usr/libexec/sudoers.so", {st_mode=S_IFREG|0755, st_size=291784, ...}) = 0
rt_sigprocmask(SIG_BLOCK, NULL, [], 8)  = 0
rt_sigaction(SIGINT, {SIG_IGN, [], SA_RESTORER|SA_RESTART, 0x7f7c5998a9a0}, {SIG_DFL, [], 0}, 8) = 0
rt_sigaction(SIGQUIT, {SIG_IGN, [], SA_RESTORER|SA_RESTART, 0x7f7c5998a9a0}, {SIG_DFL, [], 0}, 8) = 0
rt_sigaction(SIGTSTP, {SIG_IGN, [], SA_RESTORER|SA_RESTART, 0x7f7c5998a9a0}, {SIG_DFL, [], 0}, 8) = 0
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
lseek(3, 0, SEEK_CUR)                   = 0
open("/etc/group", O_RDONLY|O_CLOEXEC)  = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=634, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
lseek(4, 0, SEEK_CUR)                   = 0
open("/usr/share/locale/locale.alias", O_RDONLY) = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=2512, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a784000
read(5, "# Locale name alias data base.\n#"..., 4096) = 2512
read(5, "", 4096)                       = 0
close(5)                                = 0
munmap(0x7f7c5a784000, 4096)            = 0
open("/usr/share/locale/pl_PL.UTF-8/LC_MESSAGES/sudoers.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl_PL.utf8/LC_MESSAGES/sudoers.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl_PL/LC_MESSAGES/sudoers.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl.UTF-8/LC_MESSAGES/sudoers.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl.utf8/LC_MESSAGES/sudoers.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl/LC_MESSAGES/sudoers.mo", O_RDONLY) = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=36751, ...}) = 0
mmap(NULL, 36751, PROT_READ, MAP_PRIVATE, 5, 0) = 0x7f7c5a750000
close(5)                                = 0
open("/etc/localtime", O_RDONLY)        = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=2679, ...}) = 0
fstat(5, {st_mode=S_IFREG|0644, st_size=2679, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a784000
read(5, "TZif2\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\n\0\0\0\n\0\0\0\0"..., 4096) = 2679
lseek(5, -1698, SEEK_CUR)               = 981
read(5, "TZif2\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\v\0\0\0\v\0\0\0\0"..., 4096) = 1698
close(5)                                = 0
munmap(0x7f7c5a784000, 4096)            = 0
lseek(3, 0, SEEK_SET)                   = 0
read(3, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
socket(PF_FILE, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = 3
connect(3, {sa_family=AF_FILE, path="/var/run/nscd/socket"}, 110) = -1 ENOENT (No such file or directory)
close(3)                                = 0
socket(PF_FILE, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = 3
connect(3, {sa_family=AF_FILE, path="/var/run/nscd/socket"}, 110) = -1 ENOENT (No such file or directory)
close(3)                                = 0
lseek(4, 0, SEEK_SET)                   = 0
read(4, "root:x:0:\nbin:x:1:bin,daemon\ndae"..., 4096) = 634
close(4)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
open("/etc/nsswitch.conf", O_RDONLY)    = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=1688, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "#\n# /etc/nsswitch.conf\n#\n# An ex"..., 4096) = 1688
read(3, "", 4096)                       = 0
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
getresuid([0], [0], [0])                = 0
getresgid([0], [0], [0])                = 0
setresuid(4294967295, 1, 4294967295)    = 0
stat("/etc/sudoers", {st_mode=S_IFREG|0440, st_size=4312, ...}) = 0
open("/etc/sudoers", O_RDONLY)          = 3
fstat(3, {st_mode=S_IFREG|0440, st_size=4312, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(3, "## Sudoers allows particular use"..., 4096) = 4096
lseek(3, 0, SEEK_SET)                   = 0
fcntl(3, F_SETFD, FD_CLOEXEC)           = 0
setresuid(4294967295, 0, 4294967295)    = 0
setresuid(4294967295, 0, 4294967295)    = 0
setresgid(4294967295, 4294967295, 4294967295) = 0
ioctl(3, SNDCTL_TMR_TIMEBASE or TCGETS, 0x7fff3965c620) = -1 ENOTTY (Inappropriate ioctl for device)
read(3, "## Sudoers allows particular use"..., 8192) = 4312
read(3, "", 4096)                       = 0
stat("/etc/sudoers.d", {st_mode=S_IFDIR|0750, st_size=4096, ...}) = 0
open("/etc/sudoers.d", O_RDONLY|O_NONBLOCK|O_DIRECTORY|O_CLOEXEC) = 4
fcntl(4, F_GETFD)                       = 0x1 (flags FD_CLOEXEC)
getdents(4, /* 2 entries */, 32768)     = 48
getdents(4, /* 0 entries */, 32768)     = 0
close(4)                                = 0
read(3, "", 8192)                       = 0
ioctl(3, SNDCTL_TMR_TIMEBASE or TCGETS, 0x7fff3965c630) = -1 ENOTTY (Inappropriate ioctl for device)
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
read(4, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(4)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
setresuid(4294967295, 4294967295, 4294967295) = 0
setresgid(4294967295, 4294967295, 4294967295) = 0
rt_sigprocmask(SIG_BLOCK, NULL, [], 8)  = 0
getresuid([0], [0], [0])                = 0
getresgid([0], [0], [0])                = 0
setresgid(4294967295, 1002, 4294967295) = 0
open("/proc/sys/kernel/ngroups_max", O_RDONLY) = 4
read(4, "65536\n", 31)                  = 6
close(4)                                = 0
mmap(NULL, 528384, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a6cf000
mmap(NULL, 528384, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a64e000
open("/etc/group", O_RDONLY|O_CLOEXEC)  = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=634, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
lseek(4, 0, SEEK_CUR)                   = 0
read(4, "root:x:0:\nbin:x:1:bin,daemon\ndae"..., 4096) = 634
read(4, "", 4096)                       = 0
close(4)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
munmap(0x7f7c5a64e000, 528384)          = 0
open("/etc/group", O_RDONLY|O_CLOEXEC)  = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=634, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
read(4, "root:x:0:\nbin:x:1:bin,daemon\ndae"..., 4096) = 634
close(4)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
munmap(0x7f7c5a6cf000, 528384)          = 0
setgroups(1, [1002])                    = 0
setresuid(4294967295, 1002, 4294967295) = 0
stat("/sbin/pm2", 0x7fff3965c740)       = -1 ENOENT (No such file or directory)
stat("/bin/pm2", 0x7fff3965c740)        = -1 ENOENT (No such file or directory)
stat("/usr/sbin/pm2", 0x7fff3965c740)   = -1 ENOENT (No such file or directory)
stat("/usr/bin/pm2", 0x7fff3965c740)    = -1 ENOENT (No such file or directory)
stat("/usr/local/bin/pm2", {st_mode=S_IFREG|0755, st_size=21727, ...}) = 0
setresuid(4294967295, 0, 4294967295)    = 0
setresuid(4294967295, 0, 4294967295)    = 0
setresgid(4294967295, 0, 4294967295)    = 0
setgroups(1, [0])                       = 0
setresgid(4294967295, 1002, 4294967295) = 0
setgroups(1, [1002])                    = 0
setresuid(4294967295, 1002, 4294967295) = 0
setresuid(4294967295, 0, 4294967295)    = 0
setresuid(4294967295, 0, 4294967295)    = 0
setresgid(4294967295, 0, 4294967295)    = 0
setgroups(1, [0])                       = 0
open("/dev/tty", O_RDWR|O_NOCTTY)       = 4
close(4)                                = 0
stat("/etc/pam.d", {st_mode=S_IFDIR|0755, st_size=4096, ...}) = 0
open("/etc/pam.d/sudo", O_RDONLY)       = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=202, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
read(4, "#%PAM-1.0\nauth       include    "..., 4096) = 202
open("/etc/pam.d/system-auth", O_RDONLY) = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=937, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a784000
read(5, "#%PAM-1.0\n# This file is auto-ge"..., 4096) = 937
open("/lib64/security/pam_env.so", O_RDONLY) = 6
read(6, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\300\r\0\0\0\0\0\0"..., 832) = 832
fstat(6, {st_mode=S_IFREG|0755, st_size=18592, ...}) = 0
mmap(NULL, 2113776, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 6, 0) = 0x7f7c50e88000
mprotect(0x7f7c50e8c000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5108b000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 6, 0x3000) = 0x7f7c5108b000
close(6)                                = 0
mprotect(0x7f7c5108b000, 4096, PROT_READ) = 0
open("/lib64/security/pam_fprintd.so", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl_PL.UTF-8/LC_MESSAGES/libc.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl_PL.utf8/LC_MESSAGES/libc.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl_PL/LC_MESSAGES/libc.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl.UTF-8/LC_MESSAGES/libc.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl.utf8/LC_MESSAGES/libc.mo", O_RDONLY) = -1 ENOENT (No such file or directory)
open("/usr/share/locale/pl/LC_MESSAGES/libc.mo", O_RDONLY) = 6
fstat(6, {st_mode=S_IFREG|0644, st_size=134085, ...}) = 0
mmap(NULL, 134085, PROT_READ, MAP_PRIVATE, 6, 0) = 0x7f7c5a728000
close(6)                                = 0
open("/usr/lib64/gconv/gconv-modules.cache", O_RDONLY) = 6
fstat(6, {st_mode=S_IFREG|0644, st_size=26060, ...}) = 0
mmap(NULL, 26060, PROT_READ, MAP_SHARED, 6, 0) = 0x7f7c5a720000
close(6)                                = 0
futex(0x7f7c59ce6f60, FUTEX_WAKE_PRIVATE, 2147483647) = 0
open("/usr/lib64/gconv/ISO8859-2.so", O_RDONLY) = 6
read(6, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\200\4\0\0\0\0\0\0"..., 832) = 832
fstat(6, {st_mode=S_IFREG|0755, st_size=12480, ...}) = 0
mmap(NULL, 2105376, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 6, 0) = 0x7f7c50c80000
mprotect(0x7f7c50c82000, 2093056, PROT_NONE) = 0
mmap(0x7f7c50e81000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 6, 0x1000) = 0x7f7c50e81000
close(6)                                = 0
mprotect(0x7f7c50e81000, 4096, PROT_READ) = 0
brk(0x7f7c5c87c000)                     = 0x7f7c5c87c000
socket(PF_FILE, SOCK_DGRAM|SOCK_CLOEXEC, 0) = 6
connect(6, {sa_family=AF_FILE, path="/dev/log"}, 110) = 0
sendto(6, "<83>Nov 13 15:17:25 sudo: PAM un"..., 192, MSG_NOSIGNAL, NULL, 0) = 192
sendto(6, "<83>Nov 13 15:17:25 sudo: PAM ad"..., 82, MSG_NOSIGNAL, NULL, 0) = 82
open("/lib64/security/pam_unix.so", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0000&\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=51952, ...}) = 0
mmap(NULL, 2196352, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c50a60000
mprotect(0x7f7c50a6c000, 2093056, PROT_NONE) = 0
mmap(0x7f7c50c6b000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0xb000) = 0x7f7c50c6b000
mmap(0x7f7c50c6d000, 45952, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c50c6d000
close(7)                                = 0
open("/etc/ld.so.cache", O_RDONLY)      = 7
fstat(7, {st_mode=S_IFREG|0644, st_size=32717, ...}) = 0
mmap(NULL, 32717, PROT_READ, MAP_PRIVATE, 7, 0) = 0x7f7c5a718000
close(7)                                = 0
open("/lib64/libnsl.so.1", O_RDONLY)    = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0p@\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=113432, ...}) = 0
mmap(NULL, 2198192, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c50840000
mprotect(0x7f7c50856000, 2093056, PROT_NONE) = 0
mmap(0x7f7c50a55000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0x15000) = 0x7f7c50a55000
mmap(0x7f7c50a57000, 6832, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c50a57000
close(7)                                = 0
mprotect(0x7f7c50a55000, 4096, PROT_READ) = 0
mprotect(0x7f7c50c6b000, 4096, PROT_READ) = 0
munmap(0x7f7c5a718000, 32717)           = 0
open("/lib64/security/pam_succeed_if.so", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\340\v\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=14384, ...}) = 0
mmap(NULL, 2109624, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c50638000
mprotect(0x7f7c5063b000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5083a000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0x2000) = 0x7f7c5083a000
close(7)                                = 0
mprotect(0x7f7c5083a000, 4096, PROT_READ) = 0
open("/lib64/security/pam_deny.so", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0000\5\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=5952, ...}) = 0
mmap(NULL, 2101272, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c50430000
mprotect(0x7f7c50431000, 2093056, PROT_NONE) = 0
mmap(0x7f7c50630000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0) = 0x7f7c50630000
close(7)                                = 0
mprotect(0x7f7c50630000, 4096, PROT_READ) = 0
read(5, "", 4096)                       = 0
close(5)                                = 0
munmap(0x7f7c5a784000, 4096)            = 0
open("/etc/pam.d/system-auth", O_RDONLY) = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=937, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a784000
read(5, "#%PAM-1.0\n# This file is auto-ge"..., 4096) = 937
open("/lib64/security/pam_localuser.so", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0@\10\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=10200, ...}) = 0
mmap(NULL, 2105440, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c50228000
mprotect(0x7f7c50229000, 2097152, PROT_NONE) = 0
mmap(0x7f7c50429000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0x1000) = 0x7f7c50429000
close(7)                                = 0
mprotect(0x7f7c50429000, 4096, PROT_READ) = 0
open("/lib64/security/pam_permit.so", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\360\5\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=6040, ...}) = 0
mmap(NULL, 2101288, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c50020000
mprotect(0x7f7c50021000, 2093056, PROT_NONE) = 0
mmap(0x7f7c50220000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0) = 0x7f7c50220000
close(7)                                = 0
mprotect(0x7f7c50220000, 4096, PROT_READ) = 0
read(5, "", 4096)                       = 0
close(5)                                = 0
munmap(0x7f7c5a784000, 4096)            = 0
open("/etc/pam.d/system-auth", O_RDONLY) = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=937, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a784000
read(5, "#%PAM-1.0\n# This file is auto-ge"..., 4096) = 937
open("/lib64/security/pam_cracklib.so", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\300\f\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=14432, ...}) = 0
mmap(NULL, 2109672, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c4fe18000
mprotect(0x7f7c4fe1b000, 2093056, PROT_NONE) = 0
mmap(0x7f7c5001a000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0x2000) = 0x7f7c5001a000
close(7)                                = 0
open("/etc/ld.so.cache", O_RDONLY)      = 7
fstat(7, {st_mode=S_IFREG|0644, st_size=32717, ...}) = 0
mmap(NULL, 32717, PROT_READ, MAP_PRIVATE, 7, 0) = 0x7f7c5a718000
close(7)                                = 0
open("/usr/lib64/libcrack.so.2", O_RDONLY) = 7
read(7, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0p8\0\0\0\0\0\0"..., 832) = 832
fstat(7, {st_mode=S_IFREG|0755, st_size=38712, ...}) = 0
mmap(NULL, 2148896, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 7, 0) = 0x7f7c4fc08000
mprotect(0x7f7c4fc10000, 2097152, PROT_NONE) = 0
mmap(0x7f7c4fe10000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 7, 0x8000) = 0x7f7c4fe10000
mmap(0x7f7c4fe11000, 14880, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7c4fe11000
close(7)                                = 0
mprotect(0x7f7c5001a000, 4096, PROT_READ) = 0
munmap(0x7f7c5a718000, 32717)           = 0
read(5, "", 4096)                       = 0
close(5)                                = 0
munmap(0x7f7c5a784000, 4096)            = 0
open("/lib64/security/pam_keyinit.so", O_RDONLY) = 5
read(5, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0`\10\0\0\0\0\0\0"..., 832) = 832
fstat(5, {st_mode=S_IFREG|0755, st_size=10224, ...}) = 0
mmap(NULL, 2105488, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 5, 0) = 0x7f7c4fa00000
mprotect(0x7f7c4fa02000, 2093056, PROT_NONE) = 0
mmap(0x7f7c4fc01000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 5, 0x1000) = 0x7f7c4fc01000
close(5)                                = 0
mprotect(0x7f7c4fc01000, 4096, PROT_READ) = 0
open("/lib64/security/pam_limits.so", O_RDONLY) = 5
read(5, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0`\20\0\0\0\0\0\0"..., 832) = 832
fstat(5, {st_mode=S_IFREG|0755, st_size=18592, ...}) = 0
mmap(NULL, 2113840, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 5, 0) = 0x7f7c4f7f8000
mprotect(0x7f7c4f7fc000, 2093056, PROT_NONE) = 0
mmap(0x7f7c4f9fb000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 5, 0x3000) = 0x7f7c4f9fb000
close(5)                                = 0
mprotect(0x7f7c4f9fb000, 4096, PROT_READ) = 0
read(4, "", 4096)                       = 0
close(4)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
open("/etc/pam.d/other", O_RDONLY)      = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=154, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
read(4, "#%PAM-1.0\nauth     required     "..., 4096) = 154
read(4, "", 4096)                       = 0
close(4)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
sendto(6, "<85>Nov 13 15:17:25 sudo:     ro"..., 136, MSG_NOSIGNAL, NULL, 0) = 136
close(6)                                = 0
close(3)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
umask(022)                              = 022
umask(022)                              = 022
rt_sigaction(SIGINT, {SIG_DFL, [], SA_RESTORER, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGQUIT, {SIG_DFL, [], SA_RESTORER, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGTSTP, {SIG_DFL, [], SA_RESTORER, 0x7f7c5998a9a0}, NULL, 8) = 0
socket(PF_NETLINK, SOCK_RAW, 9)         = 3
fcntl(3, F_SETFD, FD_CLOEXEC)           = 0
fcntl(3, F_SETFD, FD_CLOEXEC)           = 0
ioctl(0, SNDCTL_TMR_TIMEBASE or TCGETS, {B38400 opost isig icanon echo ...}) = 0
readlink("/proc/self/fd/0", "/dev/pts/2"..., 31) = 10
lstat("/dev/pts/2", {st_mode=S_IFCHR|0620, st_rdev=makedev(136, 2), ...}) = 0
getcwd("/home/askme/www/askme.pro", 4096) = 26
sendto(3, "x\0\0\0c\4\5\0\1\0\0\0\0\0\0\0cwd=\"/home/askme"..., 120, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 120
poll([{fd=3, events=POLLIN}], 1, 500)   = 1 ([{fd=3, revents=POLLIN}])
recvfrom(3, "$\0\0\0\2\0\0\0\1\0\0\0\0328\0\0\0\0\0\0x\0\0\0c\4\5\0\1\0\0\0"..., 8988, MSG_PEEK|MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
recvfrom(3, "$\0\0\0\2\0\0\0\1\0\0\0\0328\0\0\0\0\0\0x\0\0\0c\4\5\0\1\0\0\0"..., 8988, MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
setresuid(4294967295, 4294967295, 4294967295) = 0
setresgid(4294967295, 4294967295, 4294967295) = 0
rt_sigprocmask(SIG_BLOCK, NULL, [], 8)  = 0
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
lseek(4, 0, SEEK_CUR)                   = 0
open("/etc/group", O_RDONLY|O_CLOEXEC)  = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=634, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a785000
lseek(5, 0, SEEK_CUR)                   = 0
lseek(4, 0, SEEK_SET)                   = 0
read(4, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(4)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
close(5)                                = 0
munmap(0x7f7c5a785000, 4096)            = 0
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 4
fstat(4, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(4, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(4)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
setuid(0)                               = 0
socketpair(PF_FILE, SOCK_DGRAM, 0, [4, 5]) = 0
pipe([6, 7])                            = 0
fcntl(6, F_GETFL)                       = 0 (flags O_RDONLY)
fcntl(6, F_SETFL, O_RDONLY|O_NONBLOCK)  = 0
fcntl(7, F_GETFL)                       = 0x1 (flags O_WRONLY)
fcntl(7, F_SETFL, O_WRONLY|O_NONBLOCK)  = 0
rt_sigaction(SIGALRM, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGCHLD, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGPIPE, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGTERM, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGUSR1, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGUSR2, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGHUP, {0x7f7c5a76cd10, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGINT, {0x7f7c5a76cd10, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGQUIT, {0x7f7c5a76cd10, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
getpgrp()                               = 14361
rt_sigaction(SIGCONT, {0x7f7c5a76ccd0, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigaction(SIGTSTP, {0x7f7c5a76cd10, [], SA_RESTORER|SA_INTERRUPT|SA_SIGINFO, 0x7f7c5998a9a0}, NULL, 8) = 0
rt_sigprocmask(SIG_BLOCK, NULL, [], 8)  = 0
open("/etc/security/pam_env.conf", O_RDONLY) = 8
fstat(8, {st_mode=S_IFREG|0644, st_size=2980, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(8, "#\n# This is the configuration fi"..., 4096) = 2980
read(8, "", 4096)                       = 0
close(8)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
open("/etc/environment", O_RDONLY)      = 8
fstat(8, {st_mode=S_IFREG|0644, st_size=0, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(8, "", 4096)                       = 0
close(8)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
socket(PF_NETLINK, SOCK_RAW, 9)         = 8
fcntl(8, F_SETFD, FD_CLOEXEC)           = 0
readlink("/proc/self/exe", "/usr/bin/sudo", 4096) = 13
sendto(8, "t\0\0\0O\4\5\0\2\0\0\0\0\0\0\0op=PAM:setcred a"..., 116, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 116
poll([{fd=8, events=POLLIN}], 1, 500)   = 1 ([{fd=8, revents=POLLIN}])
recvfrom(8, "$\0\0\0\2\0\0\0\2\0\0\0\17\354\377\377\0\0\0\0t\0\0\0O\4\5\0\2\0\0\0"..., 8988, MSG_PEEK|MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
recvfrom(8, "$\0\0\0\2\0\0\0\2\0\0\0\17\354\377\377\0\0\0\0t\0\0\0O\4\5\0\2\0\0\0"..., 8988, MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
close(8)                                = 0
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 8
fstat(8, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(8, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(8)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
getuid()                                = 0
getgid()                                = 0
setregid(1002, 4294967295)              = 0
setreuid(1002, 4294967295)              = 0
keyctl(0, 0xfffffffd, 0, 0xca, 0x7fff3965c370) = 931889326
keyctl(0, 0xfffffffb, 0, 0x7fff3965c370, 0x7f7c59ce7ee8) = 458131171
setreuid(0, 4294967295)                 = 0
setregid(0, 4294967295)                 = 0
open("/etc/passwd", O_RDONLY|O_CLOEXEC) = 8
fstat(8, {st_mode=S_IFREG|0644, st_size=1360, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(8, "root:x:0:0:root:/root:/bin/bash\n"..., 4096) = 1360
close(8)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
getrlimit(RLIMIT_CPU, {rlim_cur=RLIM_INFINITY, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_FSIZE, {rlim_cur=RLIM_INFINITY, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_DATA, {rlim_cur=RLIM_INFINITY, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_STACK, {rlim_cur=10240*1024, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_CORE, {rlim_cur=0, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_RSS, {rlim_cur=RLIM_INFINITY, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_NPROC, {rlim_cur=123266, rlim_max=123266}) = 0
getrlimit(RLIMIT_NOFILE, {rlim_cur=1024, rlim_max=4*1024}) = 0
getrlimit(RLIMIT_MEMLOCK, {rlim_cur=64*1024, rlim_max=64*1024}) = 0
getrlimit(RLIMIT_AS, {rlim_cur=RLIM_INFINITY, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_LOCKS, {rlim_cur=RLIM_INFINITY, rlim_max=RLIM_INFINITY}) = 0
getrlimit(RLIMIT_SIGPENDING, {rlim_cur=123266, rlim_max=123266}) = 0
getrlimit(RLIMIT_MSGQUEUE, {rlim_cur=800*1024, rlim_max=800*1024}) = 0
getrlimit(RLIMIT_NICE, {rlim_cur=0, rlim_max=0}) = 0
getrlimit(RLIMIT_RTPRIO, {rlim_cur=0, rlim_max=0}) = 0
getpriority(PRIO_PROCESS, 0)            = 20
open("/etc/security/limits.conf", O_RDONLY) = 8
fstat(8, {st_mode=S_IFREG|0644, st_size=1825, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(8, "# /etc/security/limits.conf\n#\n#E"..., 4096) = 1825
read(8, "", 4096)                       = 0
close(8)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
open("/etc/security/limits.d", O_RDONLY|O_NONBLOCK|O_DIRECTORY|O_CLOEXEC) = 8
getdents(8, /* 3 entries */, 32768)     = 88
getdents(8, /* 0 entries */, 32768)     = 0
close(8)                                = 0
open("/etc/security/limits.d/90-nproc.conf", O_RDONLY) = 8
fstat(8, {st_mode=S_IFREG|0644, st_size=191, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(8, "# Default limit for number of us"..., 4096) = 191
read(8, "", 4096)                       = 0
close(8)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
setrlimit(RLIMIT_NPROC, {rlim_cur=1024, rlim_max=123266}) = 0
setpriority(PRIO_PROCESS, 0, 0)         = 0
socket(PF_NETLINK, SOCK_RAW, 9)         = 8
fcntl(8, F_SETFD, FD_CLOEXEC)           = 0
readlink("/proc/self/exe", "/usr/bin/sudo", 4096) = 13
sendto(8, "x\0\0\0Q\4\5\0\3\0\0\0\0\0\0\0op=PAM:session_o"..., 120, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 120
poll([{fd=8, events=POLLIN}], 1, 500)   = 1 ([{fd=8, revents=POLLIN}])
recvfrom(8, "$\0\0\0\2\0\0\0\3\0\0\0\16\354\377\377\0\0\0\0x\0\0\0Q\4\5\0\3\0\0\0"..., 8988, MSG_PEEK|MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
recvfrom(8, "$\0\0\0\2\0\0\0\3\0\0\0\16\354\377\377\0\0\0\0x\0\0\0Q\4\5\0\3\0\0\0"..., 8988, MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
close(8)                                = 0
clone(child_stack=0, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7f7c5a787a70) = 14363
close(5)                                = 0
select(7, [4 6], [], NULL, NULL)        = ? ERESTARTNOHAND (To be restarted)
--- SIGCHLD (Child exited) @ 0 (0) ---
write(7, "\21", 1)                      = 1
rt_sigreturn(0x7)                       = -1 EINTR (Interrupted system call)
select(7, [4 6], [], NULL, NULL)        = 1 (in [6])
read(6, "\21", 1)                       = 1
wait4(14363, [{WIFEXITED(s) && WEXITSTATUS(s) == 0}], WNOHANG|WSTOPPED, NULL) = 14363
rt_sigprocmask(SIG_BLOCK, NULL, [], 8)  = 0
socket(PF_NETLINK, SOCK_RAW, 9)         = 5
fcntl(5, F_SETFD, FD_CLOEXEC)           = 0
readlink("/proc/self/exe", "/usr/bin/sudo", 4096) = 13
sendto(5, "x\0\0\0R\4\5\0\4\0\0\0\0\0\0\0op=PAM:session_c"..., 120, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 120
poll([{fd=5, events=POLLIN}], 1, 500)   = 1 ([{fd=5, revents=POLLIN}])
recvfrom(5, "$\0\0\0\2\0\0\0\4\0\0\0\r\354\377\377\0\0\0\0x\0\0\0R\4\5\0\4\0\0\0"..., 8988, MSG_PEEK|MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
recvfrom(5, "$\0\0\0\2\0\0\0\4\0\0\0\r\354\377\377\0\0\0\0x\0\0\0R\4\5\0\4\0\0\0"..., 8988, MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
close(5)                                = 0
open("/etc/security/pam_env.conf", O_RDONLY) = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=2980, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(5, "#\n# This is the configuration fi"..., 4096) = 2980
read(5, "", 4096)                       = 0
close(5)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
open("/etc/environment", O_RDONLY)      = 5
fstat(5, {st_mode=S_IFREG|0644, st_size=0, ...}) = 0
mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7c5a786000
read(5, "", 4096)                       = 0
close(5)                                = 0
munmap(0x7f7c5a786000, 4096)            = 0
socket(PF_NETLINK, SOCK_RAW, 9)         = 5
fcntl(5, F_SETFD, FD_CLOEXEC)           = 0
readlink("/proc/self/exe", "/usr/bin/sudo", 4096) = 13
sendto(5, "t\0\0\0P\4\5\0\5\0\0\0\0\0\0\0op=PAM:setcred a"..., 116, 0, {sa_family=AF_NETLINK, pid=0, groups=00000000}, 12) = 116
poll([{fd=5, events=POLLIN}], 1, 500)   = 1 ([{fd=5, revents=POLLIN}])
recvfrom(5, "$\0\0\0\2\0\0\0\5\0\0\0\f\354\377\377\0\0\0\0t\0\0\0P\4\5\0\5\0\0\0"..., 8988, MSG_PEEK|MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
recvfrom(5, "$\0\0\0\2\0\0\0\5\0\0\0\f\354\377\377\0\0\0\0t\0\0\0P\4\5\0\5\0\0\0"..., 8988, MSG_DONTWAIT, {sa_family=AF_NETLINK, pid=0, groups=00000000}, [12]) = 36
close(5)                                = 0
munmap(0x7f7c50e88000, 2113776)         = 0
munmap(0x7f7c50a60000, 2196352)         = 0
munmap(0x7f7c50840000, 2198192)         = 0
munmap(0x7f7c50638000, 2109624)         = 0
munmap(0x7f7c50430000, 2101272)         = 0
munmap(0x7f7c50228000, 2105440)         = 0
munmap(0x7f7c50020000, 2101288)         = 0
munmap(0x7f7c4fe18000, 2109672)         = 0
munmap(0x7f7c4fc08000, 2148896)         = 0
munmap(0x7f7c4fa00000, 2105488)         = 0
munmap(0x7f7c4f7f8000, 2113840)         = 0
exit_group(0)                           = ?
