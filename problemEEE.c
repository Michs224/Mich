#include <stdio.h>

int main() {
	int i, j, N,K;

    scanf("%d  %d", &N,&K);

    
    for(i=1; i<=N; i++)
    {
        
        for(j=1; j<=N; j++)
        {
            
            printf("#");
        }
        
    
        printf("\n");
    }
    printf("\n");
  	for (i=1; i<=N; i++){
      if (i==K||i==K*2){
         for (j=1; j<=N; j++){
            printf("#");
         }
      }
      else{
         for (j=1; j<=N; j++){
            if (j==1 || j==N){
               printf(".");
            }
            else{
               printf(".");
            }
         }
      }
    printf("\n");
	}
	printf("\n");
	for (i=1; i<=N; i++){
      if (i==1||i==N){
         for (j=1; j<=N; j++){
        	if (j==K || j==K*2){
               printf("#");
			}
            else{
               printf(".");
            }
		}
	}
      else{
         for (j=1; j<=N; j++){
            if (j==K || j==K*2){
               printf("#");
            }
            else{
               printf(".");
            }
         }
      }
      printf("\n");
   }
    
  return 0;
}
