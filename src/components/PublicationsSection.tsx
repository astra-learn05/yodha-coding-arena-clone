
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ExternalLink, Users } from "lucide-react";
import { format, parseISO } from "date-fns";

export interface Publication {
  id: string;
  title: string;
  publication_name: string;
  publication_date: string;
  authors: string[];
  doi?: string;
  url?: string;
}

interface PublicationsSectionProps {
  publications: Publication[];
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ publications = [] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-amber-800 flex items-center gap-2">
            <BookOpen size={18} className="text-amber-600" />
            Publications
          </CardTitle>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {publications.length} {publications.length === 1 ? 'Publication' : 'Publications'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {publications.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Journal/Conference</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publications.map((publication) => (
                  <TableRow key={publication.id} className="hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent animate-fade-in">
                    <TableCell className="font-medium">
                      <div className="font-semibold text-gray-800">{publication.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Users size={12} />
                        {publication.authors.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-amber-700 text-sm">{publication.publication_name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <Calendar size={14} />
                        <span className="text-sm">
                          {format(parseISO(publication.publication_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {publication.doi && (
                          <a
                            href={`https://doi.org/${publication.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                            title="View DOI"
                          >
                            DOI
                          </a>
                        )}
                        {publication.url && (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-amber-100 text-amber-700 transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-xl border border-amber-100 mt-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <BookOpen size={24} className="text-amber-500" />
            </div>
            <p className="text-gray-700 mb-1 font-medium">No publications yet</p>
            <p className="text-sm text-gray-600 max-w-lg">
              Publications represent your research contributions and academic papers.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicationsSection;
