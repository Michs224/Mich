def minimum_steps(x1, y1, x2, y2):
    if x1 == x2 and y1 == y2:
        return 0
    else:
        return 1 + min(minimum_steps(x1+2, y1+1, x2, y2),
                       minimum_steps(x1+2, y1-1, x2, y2),
                       minimum_steps(x1-2, y1+1, x2, y2),
                       minimum_steps(x1-2, y1-1, x2, y2),
                       minimum_steps(x1+1, y1+2, x2, y2),
                       minimum_steps(x1+1, y1-2, x2, y2),
                       minimum_steps(x1-1, y1+2, x2, y2),
                       minimum_steps(x1-1, y1-2, x2, y2))

t = int(input())
for i in range(1, t+1):
    x1, y1, x2, y2 = input().split()
    x1, y1, x2, y2 = ord(x1[0]) - ord('A') + 1, int(x1[1]), ord(x2[0]) - ord('A') + 1, int(x2[1])
    print("Case #{}: {}".format(i, minimum_steps(x1, y1, x2, y2)))
