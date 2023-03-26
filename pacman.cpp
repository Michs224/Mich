#include<stdio.h>

int t, n, m, i, j, k;
int s;
char a[105][105];

void findPacmon(int x, int y,int n, int m){
	if (a[x][y] == '*'){
	s++;
}
	if (a[x][y] != '#'){
    a[x][y] = '#';
    if (x > 0){
        findPacmon(x - 1, y,n,m);
    }
    if (x < n - 1){
        findPacmon(x + 1, y,n,m);
    }
    if (y > 0){
        findPacmon(x, y - 1,n,m);
    }
    if (y < m - 1){
        findPacmon(x, y + 1,n,m);
    }
}
}

int main()
{
scanf("%d", &t);

for (i = 1; i <= t; i++)
{
    s = 0;
    scanf("%d %d", &n, &m);
    for (j = 0; j < n; j++){
        scanf("%s", &a[j]);
    }
    for (j = 0; j < n; j++)
    {
        for (k = 0; k < m; k++)
        {
            if (a[j][k] == 'P')
            {
                findPacmon(j, k,n,m);
                break;
            }
        }
    }

    printf("Case #%d: %d\n", i, s);
}

return 0;
}
