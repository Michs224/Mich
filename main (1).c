#include <stdio.h>
#include <string.h>

int main(){
	char str[1000], rev[1000];
    int i, j,N,k, count = 0;
	scanf("%d", &N);
	for( i=1; i<=N; i++){
		scanf("%s", str);
		//finding the length of the string
  while (str[count] != '\0')
  {
    count++;
  }
  k = count - 1;

  //reversing the string by swapping
  for (j = 0; j < count; j++)
    {
    rev[j] = str[k];
    k--;
      
            }
    printf("Case #%d: %s\n", i, rev);
	}
    
}
