#include <stdio.h>

int countFloor(char arr[][100], int n, int m, int i, int j) 
{ 

    if (i < 0 || i >= n || j < 0 || j >= m || arr[i][j] == '#') 
        return 0; 
  

    if (arr[i][j] == '.') 
    { 

        arr[i][j] = '#'; 
  
        return 1 + countFloor(arr, n, m, i + 1, j) + 
               countFloor(arr, n, m, i - 1, j) + 
               countFloor(arr, n, m, i, j + 1) + 
               countFloor(arr, n, m, i, j - 1); 
    } 
  
    return 0; 
} 

int main() 
{ 
    int t, n, m, i, j;
    char arr[100][100];
    scanf("%d", &t);
    for (int k = 0; k < t; k++)
    {
        scanf("%d %d", &n, &m);
        for (i = 0; i < n; i++)
        {
            for (j = 0; j < m; j++)
            {
                scanf(" %c", &arr[i][j]);
            }
        }
        int result = 0;
        for (i = 0; i < n; i++)
        {
            for (j = 0; j < m; j++)
            {
                if (arr[i][j] == 'S')
                {
                    result = countFloor(arr, n, m, i, j);
                    break;
                }
            }
        }
        printf("Case #%d: %d\n", k+1, result);
    }
    return 0; 
}
