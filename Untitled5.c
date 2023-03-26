#include<stdio.h>    
#include<stdlib.h>  


 int main(){  
     int a[10][10],b[10][10],mul[10][10],row,kolom,i,j,k;    
      printf("Berapa rows=");    
      scanf("%d",&row);    
      printf("Berapa kolom=");    
      scanf("%d",&kolom);    
      printf("Masukan matriks pertama=\n");    
       for(i=0;i<row;i++)    
        {    
         for(j=0;j<kolom;j++)    
         {    
          scanf("%d",&a[i][j]);    
         }    
        }     
      printf("Masukan matriks kedua=\n");    
       for(i=0;i<row;i++)    
         {    
          for(j=0;j<kolom;j++)    
           {    
            scanf("%d",&b[i][j]);    
           }    
         }    
    
    printf("Hasil adalah=\n");    
     for(i=0;i<row;i++)    
      {    
       for(j=0;j<kolom;j++)    
        {    
          mul[i][j]=0;    
           for(k=0;k<kolom;k++)    
           {     
            mul[i][j]+=a[i][k]*b[k][j];    
           }    
        }    
      }        
    for(i=0;i<row;i++)    
     {    
      for(j=0;j<kolom;j++)    
       {    
        printf("%d\t",mul[i][j]);    
       }     
        printf("\n");    
    }    
        return 0; 
    }
