#include <stdio.h>

int main (){
	int N,T,j,i,c,p,q;
	scanf ("%d",&N);
	int mat[N][N];

	if(N>2){
	for(i=0;i<N;i++){
		for(j=0;j<N;j++){
		scanf("%d,",&mat[i][j]);
	}

	}
	
	int x;
	c=N/2;
	for(x=0;x<1;x++){
		if(mat[c][c]==0) {
	printf("The value of centroid can't be 0\n");
	break;}

	
	printf("(centroid at %d,%d)\n",c,c);

	p=0;
	q=0;
	
 	if (mat[c + 1][c] == mat[c][c] || mat[c][c + 1] == mat[c][c]
	      || mat[c][c - 1] == mat[c][c] || mat[c - 1][c] == mat[c][c])
	    {

	      for (i=c+1;i>=c-1;i--)
		{
		  for (j=c+1;j>=c-1;j--)
		    {
		      if (mat[i][j] == mat[c][c])
			{
				if(i==c && j==c){
					continue;
				}
				p++;
			}
		    }
		}
	    }

	else if (mat[c + 1][c + 1] == mat[c][c] || mat[c + 1][c - 1] == mat[c][c]
		   || mat[c - 1][c + 1] == mat[c][c] || mat[c - 1][c - 1] == mat[c][c])
	    {

	      for (i=c+1;i>=c-1;i--)
		{
		  for (j=c+1;j>=c-1;j--)
		    {

		      if (mat[i][j] == mat[c][c])
			{
				if(i==c && j==c){
					continue;
				}
				q++;

			}
		    }
	}
	}

//	else if ((mat[c + 1][c] == mat[c][c] || mat[c][c + 1] == mat[c][c]
//		     || mat[c][c - 1] == mat[c][c] || mat[c - 1][c] == mat[c][c])
//		     && (mat[c + 1][c + 1] == mat[c][c] || mat[c + 1][c - 1] == mat[c][c]
//		     || mat[c - 1][c + 1] == mat[c][c] || mat[c - 1][c - 1] == mat[c][c]))
//	    {
//
//	      for (i=c+1;i>=c-1; i--)
//		{
//		  for (j=c+1;j>=c-1;j--)
//		    {
//		      if (mat[i][j] == mat[c][c])
//			{
//				if(i==c && j==c){
//					continue;
//				}
//			  p++;
//
//			}
//		    }
//		}
//	    }
		
	printf("Nearest same elements is at:");
	
	if(p>0){
	for(i=c+1;i>=c-1;i--){
		for(j=c+1;j>=c-1;j--){
			if(mat[i][j]==mat[c][c]){
				if(i==c+1 && j==c || i==c && j==c+1 || i==c && j==c-1 || i==c-1 && j==c){
					if(i==c && j==c) {
				continue;}
			printf(" (%d,%d)",i,j);	
				}
	}
	}
}printf("\n");
}
	else if(p==0){
		if(q==0){
			printf(" no nearest element.\n");
		}
		else if(q>0){
	for(i=c+1;i>=c-1;i--){
		for(j=c+1;j>=c-1;j--){
		if (mat[i][j]==mat[c][c]){
			if(i==c && j==c) {
				continue;}
			printf(" (%d,%d)",i,j);
		}
	}
	}printf("\n");
		}
	}
}
}
else printf("Size of matrix must be more than 2*2\n");
	
	return(0);
} 
